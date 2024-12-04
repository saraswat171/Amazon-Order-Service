import { Injectable } from '@nestjs/common';

import * as amqp from 'amqplib';
import { EventEmitter } from 'stream';
import {
  ConfigType,
  QueueConfig,
  RabbitMQConsumeMessage,
  RabbitMQPublishMessage,
} from '../rabbitmq.interface';
import { RabbitmqConfigService } from './rabbitmq-config.service';

@Injectable()
export class RabbitmqConnectionService {
  public rabbitMqEvents = new EventEmitter();
  private config: ConfigType;
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private maxReconnectTries = 3;
  private isMaxReconnectPolicyApplied = false;
  private reconnectTries = 0;
  private timeout: NodeJS.Timeout | null;
  constructor(private readonly rabbitMQConfigService: RabbitmqConfigService) {
    const { maxReconnectTries, reconnectPolicy } =
      this.rabbitMQConfigService.getmaxReconnectTrialsData();
    this.rabbitMQConfigService.validateConfig();
    this.config = this.rabbitMQConfigService.getConfig();
    this.maxReconnectTries = reconnectPolicy ? maxReconnectTries || 3 : 0;
    this.isMaxReconnectPolicyApplied = reconnectPolicy;
    this.timeout = null;
  }

  getConnectionConfiguration() {
    return this.config;
  }

  async exchange(exchange: string, exchangeType: string) {
    await this.channel?.assertExchange(exchange, exchangeType, {
      durable: true,
    });
  }

  async queue(
    exchange: string,
    queue: string,
    options: QueueConfig,
    routingKey = '',
  ) {
    await this.channel?.assertQueue(queue, options);
    await this.channel?.bindQueue(queue, exchange, routingKey);
  }

  async createConnection() {
    const connectionString = this.rabbitMQConfigService.getConnectionString();
    const connectionParams = this.rabbitMQConfigService.getConnectionParams();
    const data = await amqp.connect(connectionString, connectionParams);
    return data;
  }

  getChannel() {
    return this.channel;
  }

  async createChannel() {
    if (!this.connection)
      throw new Error('RabbitMQ connection has not been established yet.');
    const channel = await this.connection.createChannel();
    return channel;
  }

  async connect() {
    try {
      if (this.timeout) clearTimeout(this.timeout);
      this.connection = await this.createConnection();
      console.log('RabbitMQ is connected.');
      this.channel = await this.createChannel();
      this.rabbitMqEvents.emit('connected');
      this.reconnectTries = 0;
    } catch (error) {
      console.log(
        `Failed to establish connection to RabbitMQ: ${error.message || error}`,
      );
      await this.reconnect();
    }
  }

  async publish(message: RabbitMQPublishMessage) {
    const { exchange, bindingKey, content, properties } = message;
    return this.channel?.publish(
      exchange,
      bindingKey,
      Buffer.from(content),
      properties,
    );
  }

  async deadLetter(message: RabbitMQConsumeMessage, error: Error) {
    const poisonMessage = this.convertToPoisonMessageFormat(message, error);
    console.log(
      `ERROR RecoverabilityExecutor Moving message ${message?.properties?.messageId} to error queue because processing failed due to an exception:\n`,
      error,
    );
    const messageToPublish: RabbitMQPublishMessage = {
      exchange: this.config.fanoutExchange,
      bindingKey: this.config.errorBindingKey,
      content: JSON.stringify(poisonMessage),
      properties: { ...message.properties, persistent: true },
    };
    return this.publish(messageToPublish);
  }

  convertToPoisonMessageFormat(message: RabbitMQConsumeMessage, error: Error) {
    return {
      payload: JSON.parse(message.content?.toString() || '{}'),
      exception_details: {
        exception_type: error.message,
        stack_trace: error.stack,
        failed_at: new Date(),
      },
      endpoint: {
        name: this.config.appName,
        delivery_metadata: {
          message_type:
            message?.properties?.type || message?.properties?.headers?.type,
          exchange: message.fields.exchange,
          routing_key: message.fields.routingKey,
        },
      },
    };
  }

  async retry(message: RabbitMQConsumeMessage, error: Error) {
    const messageProperties = this.incrementRedeliveryCountAndSetTTL(message);

    console.log(
      `WARN RecoverabilityExecutor Delayed Retries will reschedule message ${message.properties.messageId} after a delay of 
       ${message.properties.expiration / 1000} seconds because of exception:\n`,
      error,
    );

    const messageToPublish: RabbitMQPublishMessage = {
      exchange: this.config.directExchange,
      bindingKey: this.config.retryBindingKey,
      content: message.content.toString(),
      properties: { ...messageProperties, persistent: true },
    };
    return this.publish(messageToPublish);
  }

  incrementRedeliveryCountAndSetTTL(message: RabbitMQConsumeMessage) {
    const redeliveryCount = parseInt(
      message.properties.headers['redelivery_count'] || 0,
    );
    message.properties.headers['redelivery_count'] = redeliveryCount + 1;
    message.properties.expiration =
      message.properties.headers['redelivery_count'] * 2000;

    return message.properties;
  }

  handleConnectionEvents() {
    this.connection.on('close', this.handleConnectionClose.bind(this));
    this.connection.on('error', this.handleConnectionError.bind(this));
    this.channel.on('error', (err) => {
      console.log('Error in channel', err);
    });

    this.channel.on('close', () => {
      console.log('Channel closed');
      this.channel = null;
      setTimeout(this.reconnect.bind(this), 5000);
    });
  }

  async handleConnectionClose() {
    console.log('Disconnected from RabbitMQ');
    if (this.timeout) clearTimeout(this.timeout);
    await this.reconnect();
  }

  async handleConnectionError(error: Error) {
    console.log('Error in RabbitMQ connection', error);
    if (this.timeout) clearTimeout(this.timeout);
    await this.reconnect();
  }

  async reconnect() {
    return new Promise<void>((resolve) => {
      this.timeout = setTimeout(async () => {
        console.log('Retires', this.reconnectTries);
        this.reconnectTries++;

        if (
          this.isMaxReconnectPolicyApplied &&
          this.hasExceededMaxReconnects(this.reconnectTries)
        ) {
          console.log('Maximum reconnect tries reached, Process exited');
          process.exit(1);
        }

        console.log(
          'Reconnecting to RabbitMQ...',
          'Attempt:',
          this.reconnectTries,
          new Date(),
        );
        await this.connect();

        resolve();
      }, 5000);
    });
  }

  hasExceededMaxReconnects(reconnectTries: number) {
    return reconnectTries > this.maxReconnectTries;
  }

  async closeChannel() {
    await this?.channel?.close();
    this.channel = null;
    console.log('Channel closed explicitly.');
  }
}

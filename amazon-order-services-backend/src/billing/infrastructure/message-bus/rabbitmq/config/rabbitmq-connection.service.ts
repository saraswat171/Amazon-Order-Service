import { Injectable } from '@nestjs/common';
import { RabbitmqConfigService } from './rabbitmq-config.service';
import * as amqp from 'amqplib';
import { EventEmitter } from 'stream';
import { jsonrepair } from 'jsonrepair';
import {
  ConfigType,
  QueueConfig,
  RabbitMQConsumeMessage,
  RabbitMQPublishMessage,
} from '../rabbitmq.interface';

@Injectable()
export class RabbitmqConnectionService {
  private config: ConfigType;
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private rabbitMqEvents = new EventEmitter();
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

  async connect() {
    try {
      if (this.timeout) clearTimeout(this.timeout);
      this.connection = await this.createConnection();

      this.connection.on('close', this.handleClose.bind(this));
      this.connection.on('error', this.handleError.bind(this));
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

  async closeChannel() {
    await this?.channel?.close();
    this.channel = null;
    console.log('Channel closed explicitly.');
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
      exchange: this.config.directExchange,
      bindingKey: this.config.errorBindingKey,
      content: JSON.stringify(poisonMessage),
      properties: { ...message.properties, persistent: true },
    };
    return this.publish(messageToPublish);
  }

  private convertToPoisonMessageFormat(
    message: RabbitMQConsumeMessage,
    error: Error,
  ) {
    const parsedMessage = this.robustParseMessageContent(message);
    return {
      payload: parsedMessage,
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

  private incrementRedeliveryCountAndSetTTL(message: RabbitMQConsumeMessage) {
    const redeliveryCount = parseInt(
      message.properties.headers['redelivery_count'] || 0,
    );
    message.properties.headers['redelivery_count'] = redeliveryCount + 1;
    message.properties.expiration =
      message.properties.headers['redelivery_count'] * 2000;

    return message.properties;
  }

  private async handleClose() {
    console.log('Disconnected from RabbitMQ');
    if (this.timeout) clearTimeout(this.timeout);
    await this.reconnect();
  }

  private async handleError(e) {
    console.log('Error in RabbitMQ connection', e);
    if (this.timeout) clearTimeout(this.timeout);
    await this.reconnect();
  }

  private async reconnect() {
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

  private hasExceededMaxReconnects(reconnectTries: number) {
    return reconnectTries > this.maxReconnectTries;
  }

  robustParseMessageContent(message: RabbitMQConsumeMessage) {
    try {
      return JSON.parse(message.content.toString());
    } catch (err) {
      console.warn('WARNING: Failed to parse message content initially');
      return this.repairMessageContent(message);
    }
  }

  private repairMessageContent(message: RabbitMQConsumeMessage) {
    try {
      const repairedMessage = jsonrepair(message?.content?.toString() || '{}');
      return JSON.parse(repairedMessage);
    } catch (repairError) {
      console.error(
        `ERROR: Failed to repair and parse message ${message?.properties?.messageId}. Content:`,
        message?.content?.toString(),
        'Repair error details:',
        repairError,
      );
      return {};
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InboxMessageHandler } from '../../inbox-message-handler.service';
import * as amqp from 'amqplib';
import { RabbitmqConnectionService } from '../config/rabbitmq-connection.service';
import { RabbitmqConfigurerService } from '../config/rabbitmq-configurer.service';
import { ConfigType, RabbitMQConsumeMessage } from '../rabbitmq.interface';

@Injectable()
export class ConsumerService {
  private connection: RabbitmqConnectionService;
  private config: ConfigType;
  private channel: amqp.Channel;
  private signatureTypes: string[];
  private prefetchLimit: number;

  constructor(
    private readonly rabbitmqConfigurerService: RabbitmqConfigurerService,
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    private readonly messageHandler: InboxMessageHandler,
  ) {
    this.connection = this.rabbitmqConnectionService;
    this.config = this.connection.getConnectionConfiguration();
    this.prefetchLimit = this.config.consumeMessageLimit;
    this.signatureTypes = this.messageHandler.getSignatureType();
  }

  async consumeMessage(limit: number) {
    await this.connection.connect();
    await this.rabbitmqConfigurerService.configure();
    await this.consume(limit);
  }

  async consume(limit: number) {
    this.channel = this.connection.getChannel();
    await this.channel?.prefetch(limit || this.prefetchLimit);
    await this.startConsuming();
    console.log(`Waiting for messages in ${this.config.primaryQueue}...`);
  }

  hasBeenRedeliveredTooMuch(redeliveryCount: number) {
    return redeliveryCount >= this.config.delayedRetriesNumber;
  }

  async handleError(
    message: RabbitMQConsumeMessage,
    error: Error,
    redeliveryCount: number,
  ) {
    if (this.hasBeenRedeliveredTooMuch(redeliveryCount))
      await this.connection.deadLetter(message, error);
    else await this.connection.retry(message, error);
  }

  async startConsuming() {
    await this.channel.consume(
      this.config.primaryQueue,
      async (message: RabbitMQConsumeMessage) => {
        if (message === null) return;

        console.log(
          '\n\n================= NEW MESSAGE CONSUMING AT',
          new Date(),
          '=================',
        );

        const redeliveryCount =
          message.properties.headers['redelivery_count'] || 0;
        const type =
          message?.properties?.type || message?.properties?.headers?.type;

        console.log(
          'INFO Received message:',
          type,
          '|',
          'Message redelivery count:',
          redeliveryCount,
        );

        if (!message.properties?.messageId) {
          console.log(
            'INFO Message ignored: Message does not have a messageId.',
          );
          this?.channel.ack(message);
          return;
        }

        if (!type || !this.signatureTypes.includes(type)) {
          console.log(
            'INFO Message ignored: No available handler found or missing message type property.',
          );
          this?.channel.ack(message);
          return;
        }

        try {
          await this.messageHandler.handleMessage(
            message,
            this.config.immediateRetriesNumber,
          );
        } catch (error) {
          await this.handleError(message, error, redeliveryCount);
        } finally {
          this?.channel.ack(message);
        }
      },
    );
  }
}

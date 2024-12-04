import { Injectable } from '@nestjs/common';
import { RabbitmqConnectionService } from '../config/rabbitmq-connection.service';
import { RabbitmqConfigurerService } from '../config/rabbitmq-configurer.service';
import { ConfigType, RabbitMQPublishMessage } from '../rabbitmq.interface';
import { OutboxMessageRepository } from 'src/billing/infrastructure/repositories/billing-outbox-message/outbox-message.repository';
import { BillingOutboxMessage } from 'src/billing/domain/billing-outbox-message/billing-outbox-message.entity';

@Injectable()
export class ProducerService {
  private connection: RabbitmqConnectionService;
  private config: ConfigType;

  constructor(
    private readonly rabbitmqConfigurerService: RabbitmqConfigurerService,
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    private readonly outboxMessageRepository: OutboxMessageRepository,
  ) {
    this.connection = this.rabbitmqConnectionService;
    this.config = this.connection.getConnectionConfiguration();
  }

  async publishMessages(messages: BillingOutboxMessage[]) {
    await this.connect();

    for (const message of messages) {
      await this.publisher(message);
    }

    await this.close();
  }

  private async connect() {
    await this.connection.connect();
    await this.rabbitmqConfigurerService.configure();
  }

  private async close() {
    await this.connection.closeChannel();
  }

  private async publisher(outboxMessage: BillingOutboxMessage) {
    try {
      const message = outboxMessage.body;
      const properties = outboxMessage.properties;
      const messageToPublish: RabbitMQPublishMessage = {
        exchange: this.config.fanoutExchange,
        bindingKey: '',
        content: JSON.stringify(message),
        properties: { ...properties, persistent: true },
      };

      const isPublished = await this.connection.publish(messageToPublish);
      if (!isPublished) throw new Error('Message could not be published.');

      outboxMessage.markAsSent();

      await this.outboxMessageRepository.save(outboxMessage);
    } catch (error) {
      console.log(
        `Error while publishing message ${outboxMessage.type} with id ${outboxMessage.message_id}`,
        error,
      );
    }
  }
}

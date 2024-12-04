import { Injectable } from '@nestjs/common';
import { RabbitmqConnectionService } from '../config/rabbitmq-connection.service';
import { ConfigType, RabbitMQPublishMessage } from '../rabbitmq.interface';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';
import { SalesOutboxMessage } from 'src/sales/domain/sales-outbox-message/sales-outbox-message.entity';

@Injectable()
export class ProducerService {
  private connection: RabbitmqConnectionService;
  private config: ConfigType;

  constructor(
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    private readonly outboxMessageRepository: OutboxMessageRepository,
  ) {
    this.connection = this.rabbitmqConnectionService;
    this.config = this.connection.getConnectionConfiguration();
  }

  async publishMessages(messages: SalesOutboxMessage[]) {
    for (const message of messages) {
      await this.publisher(message);
    }

    await this.close();
  }

  async close() {
    await this.connection.closeChannel();
  }

  async publisher(outboxMessage: SalesOutboxMessage) {
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

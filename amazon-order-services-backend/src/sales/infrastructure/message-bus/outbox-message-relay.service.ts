import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from './rabbitmq/workers/producer.service';
import { RabbitmqConfigurerService } from './rabbitmq/config/rabbitmq-configurer.service';
import { RabbitmqConnectionService } from './rabbitmq/config/rabbitmq-connection.service';
import { OutboxMessageRepository } from '../repository/sales-outbox-messages/sales-outbox-message.repository';

@Injectable()
export class OutboxMessageRelay {
  constructor(
    private readonly rabbitmqConfigurerService: RabbitmqConfigurerService,
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    private readonly producerService: ProducerService,
    @InjectRepository(OutboxMessageRepository)
    private outboxMessageRepository: OutboxMessageRepository,
  ) {}

  async handleMessage(limit: number) {
    try {
      await this.rabbitmqConnectionService.connect();
      await this.rabbitmqConfigurerService.configure();
      const messages =
        await this.outboxMessageRepository.getUnsentMessages(limit);
      if (!messages.total) {
        console.log('INFO: No messages pending to dispatch.');
        return;
      }

      await this.producerService.publishMessages(messages.data);
      console.log(`INFO: Published ${messages.total} messages)`);
    } catch (error) {
      console.log('Error in publishing messages ', error);
    }
  }
}

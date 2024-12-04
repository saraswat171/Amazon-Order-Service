import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from './rabbitmq/workers/producer.service';
import { OutboxMessageRepository } from '../repositories/billing-outbox-message/outbox-message.repository';

@Injectable()
export class OutboxMessageRelay {
  constructor(
    private readonly producerService: ProducerService,
    @InjectRepository(OutboxMessageRepository)
    private outboxMessageRepository: OutboxMessageRepository,
  ) {}

  async handleMessage(limit: number) {
    try {
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

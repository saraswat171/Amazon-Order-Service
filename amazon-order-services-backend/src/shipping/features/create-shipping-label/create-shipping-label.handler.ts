import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingOutboxMessageRepository } from '../../infrastructure/repositories/shipping-outbox-messages/shipping-outbox-messages.repository';
import { ShippingLabelCreated } from '../../domain/order/events/shipping-label-created';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateShippingLabelHandler {
  constructor(
    @InjectRepository(ShippingOutboxMessageRepository)
    private readonly outboxMessageRepository: ShippingOutboxMessageRepository,
    private dataSource: DataSource,
  ) {}

  public async handle(order_id: string) {
    return await this.dataSource.transaction(async (transaction) => {
      await this.outboxMessageRepository.storeOutboxMessage(
        new ShippingLabelCreated(order_id),
        transaction,
      );
    });
  }
}

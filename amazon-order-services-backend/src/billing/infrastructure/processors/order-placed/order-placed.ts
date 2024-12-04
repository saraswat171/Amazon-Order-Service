import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Message } from '../common/message.interface';
import { MessageBody } from './order-placed.interface';
import { InboxMessageRepository } from '../../repositories/billing-inbox-message/inbox-message.repository';
import { ConfirmOrderPaymentCapabilityHandler } from 'src/billing/features/billing-order/confirmOrderPaymentCapability/ConfirmOrderPaymentCapabilityHandler';

export class NotificationFortOrderPlaced {
  constructor(
    private readonly handler: ConfirmOrderPaymentCapabilityHandler,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(InboxMessageRepository)
    private readonly inboxMessageRepository: InboxMessageRepository,
  ) {}

  getHandlerName(): string {
    return this.constructor.name;
  }

  async handleEvent(payload: Message<MessageBody>) {
    await this.dataSource.transaction(async (transaction) => {
      await this.handler.handle(payload.body);
      await this.inboxMessageRepository.storeInboxMessage(
        {
          message_id: payload.messageId,
          handler_name: this.getHandlerName(),
        },
        transaction,
      );
    });
  }
}

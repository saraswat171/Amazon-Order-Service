import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { markSalesOrderStatusAsPaymentFailedhandler } from 'src/sales/features/markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed.handler';
import { DataSource } from 'typeorm';
import { InboxMessageRepository } from '../../repository/sale-inbox-messages/sale-inbox-messages.repository';
import { MessageBody } from './markSalesOrderStatusAsPaymentFailed.interface';
import { Message } from '../common/message.interface';


export class markSalesOrderStatusAsPaymentFailed {
  constructor(
    private readonly handler: markSalesOrderStatusAsPaymentFailedhandler,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(InboxMessageRepository)
    private inboxMessageRepository: InboxMessageRepository,
  ) {}

  getHandlerName(): string {
    return this.constructor.name;
  }

  async handleEvent(payload: Message<any>) {
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

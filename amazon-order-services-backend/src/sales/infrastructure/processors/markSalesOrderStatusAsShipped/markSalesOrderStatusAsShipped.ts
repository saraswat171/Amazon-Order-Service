import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MarkSalesOrderStatusAsShippedhandler } from 'src/sales/features/markSalesOrderStatusAsShipped/markSalesOrderStatusAsShipped.handler';
import { DataSource } from 'typeorm';
import { InboxMessageRepository } from '../../repository/sale-inbox-messages/sale-inbox-messages.repository';
import { Message } from '../common/message.interface';
import { MessageBody } from '../markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed.interface';


export class markSalesOrderStatusAsShipped {
  constructor(
    private readonly handler: MarkSalesOrderStatusAsShippedhandler,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(InboxMessageRepository)
    private inboxMessageRepository: InboxMessageRepository,
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

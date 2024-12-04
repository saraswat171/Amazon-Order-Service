import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { markSalesOrderStatusAsBilledhandler } from 'src/sales/features/markSalesOrderStatusAsBilled/markSalesOrderStatusAsBilled.handler';
import { DataSource } from 'typeorm';
import { InboxMessageRepository } from '../../repository/sale-inbox-messages/sale-inbox-messages.repository';
import { Message } from '../common/message.interface';
import { MessageBody } from '../markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed.interface';

export class markSalesOrderStatusAsBilled {
  constructor(
    private readonly handler: markSalesOrderStatusAsBilledhandler,
    @InjectDataSource()
    private readonly  dataSource: DataSource,
    @InjectRepository(InboxMessageRepository)
    private readonly inboxMessageRepository: InboxMessageRepository,
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

import { Injectable } from '@nestjs/common';
import { SalesInboxMessage } from 'src/sales/domain/sales-inbox-message/sales-inbox-message.entity';
import { InboxMessagePayload } from 'src/shared/interface/rabbitmq-interface';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class InboxMessageRepository extends Repository<SalesInboxMessage> {
  constructor(dataSource: DataSource) {
    super(SalesInboxMessage, dataSource.createEntityManager());
  }

  async storeInboxMessage(
    payload: InboxMessagePayload,
    transaction: EntityManager = null,
  ) {
    if (transaction) {
      return await transaction.save(SalesInboxMessage, payload);
    }
    return await this.save(payload);
  }

  async getInboxMessageExists(message_id: string, handler_name: string) {
    const criteria = { message_id, handler_name };
    return this.findOne({ where: criteria });
  }
}

import { Module } from '@nestjs/common';
import { MarkSalesOrderStatusAsShippedhandler } from './markSalesOrderStatusAsShipped.handler';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';

@Module({
  providers: [
    MarkSalesOrderStatusAsShippedhandler,
    SalesOrderRepository,
    OutboxMessageRepository,
  ],
})
export class MarkSalesOrderStatusAsShippedModule {}
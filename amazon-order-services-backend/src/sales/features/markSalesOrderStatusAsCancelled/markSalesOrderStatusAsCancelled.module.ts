import { Module } from '@nestjs/common';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';
import { markSalesOrderStatusAsCancelledhandler } from './markSalesOrderStatusAsCancelled.handler';

@Module({
  providers: [
    markSalesOrderStatusAsCancelledhandler,
    SalesOrderRepository,
    OutboxMessageRepository,
  ],
})
export class MarkSalesOrderStatusAsCancelledModule {}
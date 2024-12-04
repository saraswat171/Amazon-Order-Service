import { Module } from '@nestjs/common';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';
import { markSalesOrderStatusAsPaymentFailedhandler } from './markSalesOrderStatusAsPaymentFailed.handler';

@Module({
  providers: [
    markSalesOrderStatusAsPaymentFailedhandler,
    SalesOrderRepository,
    OutboxMessageRepository,
  ],
})
export class MarkSalesOrderStatusAsPaymentFailedModule {}
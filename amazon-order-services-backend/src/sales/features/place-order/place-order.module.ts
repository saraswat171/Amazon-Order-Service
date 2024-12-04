import { Module } from '@nestjs/common';
import { PlaceOrderHandler } from './place-order.handler';
import { PlaceOrderController } from './place-order.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';

@Module({
  imports: [CqrsModule],
  controllers: [PlaceOrderController],
  providers: [PlaceOrderHandler, SalesOrderRepository, OutboxMessageRepository],
})
export class PlaceOrderModule {}

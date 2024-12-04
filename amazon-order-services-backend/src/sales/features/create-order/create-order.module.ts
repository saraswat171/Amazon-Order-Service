import { Module } from '@nestjs/common';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderHandler } from './create-order.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { SalesProductRepository } from 'src/sales/infrastructure/repository/sales-products/sales-products.repository';

@Module({
  imports: [CqrsModule],
  controllers: [CreateOrderController],
  providers: [
    CreateOrderHandler,
    CreateOrderCommand,
    SalesOrderRepository,
    SalesProductRepository,
  ],
})
export class CreateOrderModule {}

import { Module } from '@nestjs/common';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderHandler } from './create-order.service';
import { ShippingOrderRepository } from 'src/shipping/infrastructure/repositories/order/order.repository';

@Module({
  imports: [],
  controllers: [CreateOrderController],
  providers: [ShippingOrderRepository ,CreateOrderHandler],
})
export class CreateOrderModule {}

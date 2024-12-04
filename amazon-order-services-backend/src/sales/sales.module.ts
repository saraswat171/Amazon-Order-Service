import { Module } from '@nestjs/common';
import { PlaceOrderModule } from './features/place-order/place-order.module';
import { CreateOrderModule } from './features/create-order/create-order.module';

@Module({
  imports: [CreateOrderModule, PlaceOrderModule],
})
export class SalesModule {}

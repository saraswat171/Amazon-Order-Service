import { Module } from '@nestjs/common';
import { OrdersHandler } from './orders.service';
import { OrdersController } from './orders.controller';
import { SalesHTTPClient } from 'src/infrastructure/HTTPClients/sales-http-client/sales-http-client';
import { BillingsHTTPClient } from 'src/infrastructure/HTTPClients/billing-http-client/billing-http-client';
import { ShippingHTTPClient } from 'src/infrastructure/HTTPClients/shipping-http-client/shipping-http-client';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersHandler,
    SalesHTTPClient,
    BillingsHTTPClient,
    ShippingHTTPClient,
  ],
})
export class OrdersModule {}

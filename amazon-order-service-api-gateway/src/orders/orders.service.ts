import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { SalesHTTPClient } from 'src/infrastructure/HTTPClients/sales-http-client/sales-http-client';
import { BillingsHTTPClient } from 'src/infrastructure/HTTPClients/billing-http-client/billing-http-client';
import { ShippingHTTPClient } from 'src/infrastructure/HTTPClients/shipping-http-client/shipping-http-client';
import axios from 'axios';

@Injectable()
export class OrdersHandler {
  constructor(
    private readonly salesClient: SalesHTTPClient,
    private readonly billingClient: BillingsHTTPClient,
    private readonly shippingClient: ShippingHTTPClient,
  ) {}
  async handle(payload: CreateOrderDTO) {
    const {
      order_id,
      products,
      customer_id,
      billing_account_id,
      billing_address,
      shipping_address,
    } = payload;

    const salesPromise = this.salesClient.save({
      order_id,
      products,
      customer_id,
    });

    const billingPromise = this.billingClient.save({
      order_id,
      billing_account_id,
      billing_address,
    });

    const shippingPromise = this.shippingClient.save({
      order_id,
      shipping_address,
    });

    await Promise.all([salesPromise, billingPromise, shippingPromise]);

    await axios.patch(`${process.env.SALES_SERVICE_URL}/${order_id}/place`);
  }
}

import { Product } from './create-order.dto';
export class CreateOrderCommand {
  constructor(
    public readonly order_id: string,
    public readonly customer_id: string,
    public readonly products: Product[],
  ) {}
}

export interface MessageBody {
  uuid: string;
  fired_at: Date;
  order_id: string;
  products_id: Array<{
    id: number;
    quantity: number;
  }>;
  customer_id: string;
  order_total: number;
}

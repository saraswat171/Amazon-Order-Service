export interface SalesOrderPayload {
  order_id: string;
  products: { product_id: string; quantity: number }[];
  customer_id: string;
}

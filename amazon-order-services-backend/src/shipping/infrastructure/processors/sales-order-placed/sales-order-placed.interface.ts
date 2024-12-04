export interface SalesOrderPlacedMessageBody {
  order_id: string;
  products: Product[];
  customer_id: string;
  order_total: number;
}

interface Product {
  product_id: string;
  quantity: number;
}

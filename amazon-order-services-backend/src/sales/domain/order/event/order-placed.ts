import { Event } from 'src/shared/event';
export class markSalesOrderStatusAsPlaced extends Event {
  type = 'sales.order_placed';

  getBody() {
    return {
      order_id: this.payload.order_id,
    };
  }
}

import { Event } from "src/shared/event";


export class OrderBilled extends Event {
  type =
    'billing.order_billed';

  getBody() {
    return { 
      order_id: this.payload.order_id,
    };
  }
}

import { Event } from "src/shared/event";


export class BillingPaymentFailed extends Event {
  type =
    'billing.payment_failed';

  getBody() {
    return { 
      order_id: this.payload.order_id,
    };
  }
}

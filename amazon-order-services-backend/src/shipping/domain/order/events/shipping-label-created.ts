import { Event } from "src/shared/event"


export class ShippingLabelCreated extends Event{
    type='shipping.shipping_label_created'

    getBody(){
        return {
            order_id: this.payload.order_id,  
        }
    }
}
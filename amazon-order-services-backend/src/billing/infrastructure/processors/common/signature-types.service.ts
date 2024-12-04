import { Injectable } from '@nestjs/common';
import { NotificationFortOrderPlaced } from '../order-placed/order-placed';
import { NotifiedAboutOrderBacked } from '../order-back/order-back';


@Injectable()
export class SignatureTypes {
  constructor(
    private readonly NotificationFortOrderPlaced: NotificationFortOrderPlaced,
    private readonly NotifiedAboutOrderBacked: NotifiedAboutOrderBacked,
  ) {}
  public signatureTypes: Record<string, any[]> = {
    'sales.order_placed': [this.NotificationFortOrderPlaced],
    'shipping.back_ordered': [this.NotifiedAboutOrderBacked],
  };

  public getSignatureTypes(): Record<string, any[]> {
    return this.signatureTypes;
  }
}

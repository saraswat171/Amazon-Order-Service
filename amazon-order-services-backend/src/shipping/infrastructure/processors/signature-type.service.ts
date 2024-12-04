import { Injectable } from '@nestjs/common';
import { SalesOrderPlaced } from './sales-order-placed/sales-order-placed';
import { BillingOrderBilled } from './billing-order-billed/billing-order-billed';

@Injectable()
export class SignatureTypes {
  constructor(
    private readonly orderPlaced: SalesOrderPlaced,
    private readonly orderBilled: BillingOrderBilled,
  ) {}

  public signatureTypes: Record<string, any[]> = {
    'sales.order_placed': [this.orderPlaced],
    'billing.order_billed': [this.orderBilled],
  };

  public getSignatureTypes(): Record<string, any[]> {
    return this.signatureTypes;
  }
}

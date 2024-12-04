
import { Injectable } from '@nestjs/common';
import { markSalesOrderStatusAsPaymentFailed } from './markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed';
import { markSalesOrderStatusAsBilled } from './markSalesOrderStatusAsBilled/markSalesOrderStatusAsBilled';
import { markSalesOrderStatusAsCancelled } from './markSalesOrderStatusAsCancelled/markSalesOrderStatusAsCancelled';
import { markSalesOrderStatusAsShipped } from './markSalesOrderStatusAsShipped/markSalesOrderStatusAsShipped';

@Injectable()
export class SignatureTypes {
  constructor(
    private readonly markSalesOrderStatusAsPaymentFailed: markSalesOrderStatusAsPaymentFailed,
    private readonly markSalesOrderStatusAsBilled:markSalesOrderStatusAsBilled,
    private readonly markSalesOrderStatusAsCancelled: markSalesOrderStatusAsCancelled,
    private readonly markSalesOrderStatusAsShipped:markSalesOrderStatusAsShipped
  ) {}
  public signatureTypes: Record<string, any[]> = {
    'billing.payment_failed':
      [this.markSalesOrderStatusAsPaymentFailed],
  
    'billing.order_billed':
      [this.markSalesOrderStatusAsBilled],

    'billing.order_refunded':
    [this.markSalesOrderStatusAsCancelled] ,

    'shipping.shipping_label_created':
    [this.markSalesOrderStatusAsShipped]
  };

  public getSignatureTypes(): Record<string, any[]> {
      return this.signatureTypes;

  }
}

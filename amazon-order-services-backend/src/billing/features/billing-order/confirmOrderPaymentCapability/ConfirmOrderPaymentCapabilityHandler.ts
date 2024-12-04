import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingPaymentFailed } from 'src/billing/domain/billing-order/event/billing-payment-failed';
import { OrderBilled } from 'src/billing/domain/billing-order/event/order-billed';
import { BillingAccountsRepository } from 'src/billing/infrastructure/repositories/billing-account/billing-account.repository';
import { OrderBillingRepository } from 'src/billing/infrastructure/repositories/billing-order/billing-order.repository';
import { OutboxMessageRepository } from 'src/billing/infrastructure/repositories/billing-outbox-message/outbox-message.repository';

import { DataSource } from 'typeorm';

@Injectable()
export class ConfirmOrderPaymentCapabilityHandler {
  constructor(
    @InjectRepository(OrderBillingRepository)
    private readonly orderBillingrepository: OrderBillingRepository,
    @InjectRepository(BillingAccountsRepository)
    private readonly billingAccountsRepository: BillingAccountsRepository,
    @InjectRepository(OutboxMessageRepository)
    private readonly outboxMessageRepository: OutboxMessageRepository,
    private readonly dataSource: DataSource,
  ) {}

  async handle(payload: any) {
    return await this.dataSource.transaction(async (transaction) => {
      const order = await this.orderBillingrepository.findOrder(
        payload.order_id,
      );
      console.log(order)
      const billingAccount =
        await this.billingAccountsRepository.findBillingAccount(
          order.billing_account_id,
        );
        console.log(billingAccount)

      if (payload.total_amount > billingAccount.balance) {
        await this.outboxMessageRepository.storeOutboxMessage(
          new BillingPaymentFailed(order),
          transaction,
        );
      }
      billingAccount.balance=billingAccount.balance-payload.total_amount;
      await this.billingAccountsRepository.BillingAmount(billingAccount);
      await this.outboxMessageRepository.storeOutboxMessage(
        new OrderBilled(order),
        transaction,
      );
    });
  }
}

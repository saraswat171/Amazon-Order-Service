import { Module } from '@nestjs/common';
import { ListBillingAccountModule } from './features/billing-account/list-billing-account/list-billing-account.module';
import { RegisterOrderBillingModule } from './features/billing-order/register-order-billing/register-order-billing.module';

@Module({
  imports: [ListBillingAccountModule, RegisterOrderBillingModule],
})
export class BillingModule {}

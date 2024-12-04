import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ListBillingAccountController } from './list-billing-account.controller';
import { ListBillingAccountQuery } from './list-billing-account.query';
import { ListBillingAccountHandler } from './list-billing-account.handler';
import { BillingAccountsRepository } from 'src/billing/infrastructure/repositories/billing-account/billing-account.repository';

@Module({
  imports: [CqrsModule],
  controllers: [ListBillingAccountController],
  providers: [
    BillingAccountsRepository,
    ListBillingAccountQuery,
    ListBillingAccountHandler,
  ],
})
export class ListBillingAccountModule {}

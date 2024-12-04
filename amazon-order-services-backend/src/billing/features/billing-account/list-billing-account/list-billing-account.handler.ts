import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingAccountsRepository } from 'src/billing/infrastructure/repositories/billing-account/billing-account.repository';
import { ListBillingAccountQuery } from './list-billing-account.query';

@QueryHandler(ListBillingAccountQuery)
export class ListBillingAccountHandler implements IQueryHandler<ListBillingAccountQuery> {
  constructor(
    @InjectRepository(BillingAccountsRepository)
    private readonly repository: BillingAccountsRepository,
  ) {}

  async execute(query: ListBillingAccountQuery) {
    return await this.repository.search(query);
  }
}
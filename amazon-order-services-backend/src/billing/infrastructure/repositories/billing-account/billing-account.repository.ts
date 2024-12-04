import { Injectable } from '@nestjs/common';
import { BillingAccount } from 'src/billing/domain/billing-account/billing-account.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BillingAccountsRepository extends Repository<BillingAccount> {
    constructor(private dataSource: DataSource) {
        super(BillingAccount, dataSource.createEntityManager());
    }

    async BillingAmount(payload: any, transaction = null,): Promise<BillingAccount> {
      if (transaction) {
          return await transaction.save(BillingAccount, payload);
        }
      return this.save(payload);

  }

    async search(payload: any): Promise<any> {
        const { page = 1, limit = 10 } = payload;
        const offset = limit * (page - 1);
        let queryBuilder = this.createQueryBuilder();
        const [data, total] = await queryBuilder
          .offset(offset)
          .limit(limit)
          .orderBy('created_at', 'DESC')
          .getManyAndCount();
        return { data, total, current_page: page, per_page: limit };
      }


      async findBillingAccount(billing_account_id: string): Promise<BillingAccount> {
        const billingAccount = await this.findOne({ where: { billing_account_id } });
        return billingAccount;
      }
    
}
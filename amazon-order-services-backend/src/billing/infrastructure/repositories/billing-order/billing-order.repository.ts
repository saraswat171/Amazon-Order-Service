import { Injectable } from '@nestjs/common';
import { BillingOrder } from 'src/billing/domain/billing-order/billing-order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderBillingRepository extends Repository<BillingOrder> {
    constructor(private dataSource: DataSource) {
        super(BillingOrder, dataSource.createEntityManager());
    }

    // async findByEmail(email: string): Promise<BillingOrder> {
    //     return await this.findOne({ where: { email } });
    // }

    async registerOrderBilling(payload: any, transaction = null,): Promise<BillingOrder> {
        if (transaction) {
            return await transaction.save(BillingOrder, payload);
          }
        return this.save(payload);

    }
    async findOrder(order_id: string): Promise<BillingOrder> {
        const order = await this.findOne({ where: { order_id } });
        return order;
    }


    
}
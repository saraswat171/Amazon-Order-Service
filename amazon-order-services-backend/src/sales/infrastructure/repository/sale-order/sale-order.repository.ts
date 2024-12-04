import { Injectable } from '@nestjs/common';
import { SalesOrder } from 'src/sales/domain/order/order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SalesOrderRepository extends Repository<SalesOrder> {
  constructor(dataSource: DataSource) {
    super(SalesOrder, dataSource.createEntityManager());
  }

  async createOrder(payload: any, transaction = null) {
    if (transaction) {
      return await transaction.save(SalesOrder, payload);
    }
    return await this.save(payload);
  }

  async findOrderDetails(order_id: string): Promise<SalesOrder> {
    return await this.findOne({
      where: { order_id },
    });
  }
}

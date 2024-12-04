import { Injectable } from '@nestjs/common';
import { ShippingOrder } from 'src/shipping/domain/order/order.entity';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ShippingOrderRepository extends Repository<ShippingOrder> {
  constructor(dataSource: DataSource) {
    super(ShippingOrder, dataSource.createEntityManager());
  }


  async createShipping(payload: any, transaction = null) {
    if (transaction) {
      return await transaction.save(ShippingOrder, payload);
    }
    return await this.save(payload);
  }

  async findShippingDetails(order_id: string): Promise<ShippingOrder> {
    return await this.findOne({
      where: { order_id },
    });
  }

}

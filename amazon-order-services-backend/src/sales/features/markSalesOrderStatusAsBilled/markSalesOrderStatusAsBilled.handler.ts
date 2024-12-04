import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';

@Injectable()
export class markSalesOrderStatusAsBilledhandler {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly SalesOrderRepository: SalesOrderRepository,
  ) {}

  public async handle(payload:any) {
    const orderBilled = await this.SalesOrderRepository.findOrderDetails(payload.order_id);
    orderBilled.markAsBilled();
    await this.SalesOrderRepository.createOrder(orderBilled);
  }
}

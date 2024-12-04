import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalesOrderRepository } from "src/sales/infrastructure/repository/sale-order/sale-order.repository";

@Injectable()
export class markSalesOrderStatusAsCancelledhandler {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly SalesOrderRepository: SalesOrderRepository
  ) { }

  public async handle(payload: any) {
    const orderCancelled =
      await this.SalesOrderRepository.findOrderDetails(
        payload.order_id,
      );
    orderCancelled.markAsCancelled();
    await this.SalesOrderRepository.createOrder(
      orderCancelled,
    );
  }
}

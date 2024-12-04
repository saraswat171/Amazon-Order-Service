import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalesOrderRepository } from "src/sales/infrastructure/repository/sale-order/sale-order.repository";

@Injectable()
export class markSalesOrderStatusAsPaymentFailedhandler {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly SalesOrderRepository: SalesOrderRepository
  ) { }

  public async handle(payload: any) {
    const orderFailed =
      await this.SalesOrderRepository.findOrderDetails(
        payload.order_id,
      );
    orderFailed.markAsPaymentFailed();
    await this.SalesOrderRepository.createOrder(
      orderFailed,
    );
  }
}

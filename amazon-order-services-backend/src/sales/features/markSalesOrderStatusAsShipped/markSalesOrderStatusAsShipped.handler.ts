import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalesOrderRepository } from "src/sales/infrastructure/repository/sale-order/sale-order.repository";

@Injectable()
export class MarkSalesOrderStatusAsShippedhandler {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly SalesOrderRepository: SalesOrderRepository
  ) { }

  public async handle(payload: any) {
    const orderShipped =
      await this.SalesOrderRepository.findOrderDetails(
        payload.order_id,
      );
    orderShipped.markAsReadyToShip();
    await this.SalesOrderRepository.createOrder(
      orderShipped,
    );
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingOrderRepository } from "src/shipping/infrastructure/repositories/order/order.repository";


@Injectable()
export class UpdateOrderPlacedStatusHandler {
  constructor(
    @InjectRepository(ShippingOrderRepository)
    private readonly ShippingOrderRepository: ShippingOrderRepository
  ) { }

  public async handle(payload:any) {
    const orderPlaced =
      await this.ShippingOrderRepository.findShippingDetails(
        payload.order_id,
      );
      orderPlaced.markOrderPlaced();
    await this.ShippingOrderRepository.createShipping(
        orderPlaced,
    );
  }
}


import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingOrderPayload } from "./create-order.interface";
import { ShippingOrderRepository } from "src/shipping/infrastructure/repositories/order/order.repository";

@Injectable()
export class CreateOrderHandler {
    constructor(
        @InjectRepository(ShippingOrderRepository)
        private readonly ShippingOrderRepository: ShippingOrderRepository,
    ) { }

    public async handle(payload: ShippingOrderPayload): Promise<any> {
         return await this.ShippingOrderRepository.createShipping(payload)
    }
}
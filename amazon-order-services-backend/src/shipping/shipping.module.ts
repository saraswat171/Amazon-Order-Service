import { Module } from "@nestjs/common";
import { CreateOrderModule } from "./features/create-order/create-order.module";

@Module({
    imports: [
        CreateOrderModule, 
    ]
})
export class ShippingModule { }
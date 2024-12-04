import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingOrderRepository } from "src/shipping/infrastructure/repositories/order/order.repository";
import { ShippingProductRepository } from "src/shipping/infrastructure/repositories/product/product.repository";
import { CreateShippingLabelHandler } from "../create-shipping-label/create-shipping-label.handler";


@Injectable()
export class markOrderAsBilled {
  constructor(
    @InjectRepository(ShippingOrderRepository)
    private readonly ShippingOrderRepository: ShippingOrderRepository,
    @InjectRepository(ShippingProductRepository)
    private readonly ShippingProductRepository: ShippingProductRepository,
    private readonly handler: CreateShippingLabelHandler,
  ) { }

  public async handle(payload: any) {
    console.log('payload:==================== +++++++++++', payload.order_id);
    const orderPlaced =
      await this.ShippingOrderRepository.findShippingDetails(
        payload.order_id,
      );
      if(orderPlaced?.is_placed === true ){
        const products = orderPlaced?.products;
        for (const product of products) {
          const { product_id, quantity } = product;
          const productData =
            await this.ShippingProductRepository.findProduct(product_id);
            if(productData.quantity >= quantity){
           await this.handler.handle(payload.order_id)
            }
            else {
              console.log('product quantity is less than order quantity');
            }
        
        };    
        orderPlaced.markOrderBilled();
       return await this.ShippingOrderRepository.createShipping(
            orderPlaced,
        );
      }
  }
}

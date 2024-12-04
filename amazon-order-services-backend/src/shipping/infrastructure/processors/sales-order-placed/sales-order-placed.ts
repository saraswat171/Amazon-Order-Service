import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ShippingInboxMessageRepository } from "../../repositories/shipping-inbox-messages/shipping-inbox-messages.repository";
import { Message } from "../common/message.interface";
import {  UpdateOrderPlacedStatusHandler } from "src/shipping/features/update-order-placed-status/update-order-placed-status.handler";


export class SalesOrderPlaced{
    constructor(
        private readonly handler: UpdateOrderPlacedStatusHandler,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectRepository(ShippingInboxMessageRepository)
        private readonly shippingInboxMessageRepository:ShippingInboxMessageRepository
    ){}


    getHandlerName():string{
        return this.constructor.name;
    }

    async handleEvent(payload:Message<any>){
        await this.dataSource.transaction(async (transaction)=>{
            console.log("------------Message is in the processor of the order placed")

        await this.handler.handle(payload.body);
        await this.shippingInboxMessageRepository.storeInboxMessage(
          {
            message_id: payload.messageId,
            handler_name: this.getHandlerName(),
          },
          transaction,
        );
      });
      
    }
}




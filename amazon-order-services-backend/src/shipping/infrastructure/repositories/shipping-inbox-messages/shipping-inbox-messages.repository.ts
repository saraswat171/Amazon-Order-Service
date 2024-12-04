import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { InboxMessagePayload } from "../../message-bus/rabbitmq/rabbitmq.interface";
import { ShippingInboxMessage } from "src/shipping/domain/shipping-inbox-message/shipping-inbox-message.entity";

@Injectable()
export class ShippingInboxMessageRepository extends Repository<ShippingInboxMessage> {
    constructor(dataSource: DataSource) {
        super(ShippingInboxMessage, dataSource.createEntityManager());
    }

    async storeInboxMessage(
        payload: InboxMessagePayload,
        transaction: EntityManager = null,
    ) {
        if (transaction) {
            return await transaction.save(ShippingInboxMessage, payload);
        }
        return await this.save(payload);
    }

    async getInboxMessageExists(message_id: string, handler_name: string) {
        const criteria = { message_id, handler_name };
        return this.findOne({ where: criteria });
    }
}
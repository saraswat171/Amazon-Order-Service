import { Injectable } from "@nestjs/common";
import { OutBoxStatus } from "src/shared/enums/outbox-status.enum";
import { Event } from "src/shared/event";
import { ShippingOutboxMessage } from "src/shipping/domain/shipping-outbox-message/shipping-outbox-message.entity";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class ShippingOutboxMessageRepository extends Repository<ShippingOutboxMessage> {
    constructor(dataSource: DataSource) {
        super(ShippingOutboxMessage, dataSource.createEntityManager());
    }

    createOutboxPayloadFromEvent = (
        outbox_message: Event,
    ): OutboxMessagePayloadType => {
        return {
            message_id: outbox_message.getId(),
            type: outbox_message.getType(),
            properties: outbox_message.getProperties(),
            headers: outbox_message.getHeaders(),
            body: outbox_message.getPayload(),
        };
    };

    async storeOutboxMessage(
        outbox_message: Event,
        transactionalEntityManager: EntityManager ,
    ) {
        return await transactionalEntityManager.save(
            ShippingOutboxMessage,
            this.createOutboxPayloadFromEvent(outbox_message),
        );
    }

    async getUnsentMessages(limit: number) {
        const [data, total] = await this.findAndCount({
            where: { status: OutBoxStatus.PENDING },
            take: limit,
        });
        return { data, total };
    }
}
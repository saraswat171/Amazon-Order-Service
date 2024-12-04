import { Module } from '@nestjs/common';
import { CreateShippingLabelHandler } from './create-shipping-label.handler';
import { ShippingOutboxMessageRepository } from '../../infrastructure/repositories/shipping-outbox-messages/shipping-outbox-messages.repository';

@Module({
    providers:[
        CreateShippingLabelHandler,
        ShippingOutboxMessageRepository
    ]
})
export class CreateShippingLabel {}

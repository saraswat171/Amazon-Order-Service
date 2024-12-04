import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from 'src/common/typeorm';
import { DispatchMessages } from './cli-commands/dispatch-messages';
import { HandleMessages } from './cli-commands/handle-messages';
import { RabbitmqConfigService } from './rabbitmq/config/rabbitmq-config.service';
import { RabbitmqConfigurerService } from './rabbitmq/config/rabbitmq-configurer.service';
import { RabbitmqConnectionService } from './rabbitmq/config/rabbitmq-connection.service';
import { ProducerService } from './rabbitmq/workers/producer.service';
import { ShippingOutboxMessageRepository } from '../repositories/shipping-outbox-messages/shipping-outbox-messages.repository';
import { ShippingInboxMessageRepository } from '../repositories/shipping-inbox-messages/shipping-inbox-messages.repository';
import { SignatureTypes } from '../processors/signature-type.service';
import { ConsumerService } from './rabbitmq/workers/consumer.service';
import { InboxMessageHandler } from './inbox-message-handler.service';
import { OutboxMessageRelay } from './outbox-message-relay.service';
import { SalesOrderPlaced } from '../processors/sales-order-placed/sales-order-placed';
import { BillingOrderBilled } from '../processors/billing-order-billed/billing-order-billed';
import { markOrderAsBilled } from 'src/shipping/features/update-order-billed-status/update-order-billed-status.handler';
import { ShippingOrderRepository } from '../repositories/order/order.repository';
import { ShippingProductRepository } from '../repositories/product/product.repository';
import { CreateShippingLabelHandler } from 'src/shipping/features/create-shipping-label/create-shipping-label.handler';
import { UpdateOrderPlacedStatusHandler } from 'src/shipping/features/update-order-placed-status/update-order-placed-status.handler';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule],
  providers:[
    DispatchMessages,
    HandleMessages,
    RabbitmqConfigService,
    RabbitmqConfigurerService,
    RabbitmqConnectionService,
    ProducerService,
    ShippingOutboxMessageRepository,
    ShippingInboxMessageRepository,
    SignatureTypes,
    ConsumerService,
    InboxMessageHandler,
    OutboxMessageRelay,
    SalesOrderPlaced,
    BillingOrderBilled,
    UpdateOrderPlacedStatusHandler,
    markOrderAsBilled,
    ShippingOrderRepository,
    ShippingProductRepository,
    CreateShippingLabelHandler,
  ]
})
export class RabbitmqModule {}

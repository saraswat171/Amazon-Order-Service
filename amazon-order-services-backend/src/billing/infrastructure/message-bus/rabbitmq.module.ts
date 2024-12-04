import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OutboxMessageRelay } from './outbox-message-relay.service';
import { ProducerService } from './rabbitmq/workers/producer.service';
import { RabbitmqConfigService } from './rabbitmq/config/rabbitmq-config.service';
import { InboxMessageHandler } from './inbox-message-handler.service';
import { ConsumerService } from './rabbitmq/workers/consumer.service';
import { DispatchMessages } from './cli-commands/dispatch-messages';
import { HandleMessages } from './cli-commands/handle-messages';
import { RabbitmqConfigurerService } from './rabbitmq/config/rabbitmq-configurer.service';
import { RabbitmqConnectionService } from './rabbitmq/config/rabbitmq-connection.service';
import { OutboxMessageRepository } from '../repositories/billing-outbox-message/outbox-message.repository';
import { SignatureTypes } from '../processors/common/signature-types.service';
import { InboxMessageRepository } from '../repositories/billing-inbox-message/inbox-message.repository';
import { TypeOrmModule } from 'src/common/typeorm';
import { NotificationFortOrderPlaced } from '../processors/order-placed/order-placed';
import { NotifiedAboutOrderBacked } from '../processors/order-back/order-back';
import { ConfirmOrderPaymentCapabilityHandler } from 'src/billing/features/billing-order/confirmOrderPaymentCapability/ConfirmOrderPaymentCapabilityHandler';
import { OrderBillingRepository } from '../repositories/billing-order/billing-order.repository';
import { BillingAccountsRepository } from '../repositories/billing-account/billing-account.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
  ],
  providers: [
    DispatchMessages,
    HandleMessages,
    RabbitmqConfigService,
    RabbitmqConfigurerService,
    RabbitmqConnectionService,
    ProducerService,
    OutboxMessageRepository,
    OutboxMessageRelay,
    ConsumerService,
    InboxMessageHandler,
    SignatureTypes,
    BillingAccountsRepository,
    InboxMessageRepository,
    NotificationFortOrderPlaced,
    NotifiedAboutOrderBacked,
    ConfirmOrderPaymentCapabilityHandler,
    OrderBillingRepository
  ],
})
export class RabbitmqModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DispatchMessages } from './cli-commands/dispatch-messages';
import { HandleMessages } from './cli-commands/handle-messages';
import { RabbitmqConfigService } from './rabbitmq/config/rabbitmq-config.service';
import { RabbitmqConfigurerService } from './rabbitmq/config/rabbitmq-configurer.service';
import { RabbitmqConnectionService } from './rabbitmq/config/rabbitmq-connection.service';
import { ProducerService } from './rabbitmq/workers/producer.service';
import { OutboxMessageRepository } from '../repository/sales-outbox-messages/sales-outbox-message.repository';
import { OutboxMessageRelay } from './outbox-message-relay.service';
import { ConsumerService } from './rabbitmq/workers/consumer.service';
import { InboxMessageHandler } from './inbox-message-handler.service';
import { SignatureTypes } from '../processors/signature-types.service';
import { InboxMessageRepository } from '../repository/sale-inbox-messages/sale-inbox-messages.repository';
import { TypeOrmModule } from 'src/common/typeorm';
import { markSalesOrderStatusAsPaymentFailed } from '../processors/markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed';
import { markSalesOrderStatusAsPaymentFailedhandler } from 'src/sales/features/markSalesOrderStatusAsPaymentFailed/markSalesOrderStatusAsPaymentFailed.handler';
import { markSalesOrderStatusAsBilled } from '../processors/markSalesOrderStatusAsBilled/markSalesOrderStatusAsBilled';
import { markSalesOrderStatusAsBilledhandler } from 'src/sales/features/markSalesOrderStatusAsBilled/markSalesOrderStatusAsBilled.handler';
import { markSalesOrderStatusAsCancelled } from '../processors/markSalesOrderStatusAsCancelled/markSalesOrderStatusAsCancelled';
import { markSalesOrderStatusAsCancelledhandler } from 'src/sales/features/markSalesOrderStatusAsCancelled/markSalesOrderStatusAsCancelled.handler';
import { markSalesOrderStatusAsShipped } from '../processors/markSalesOrderStatusAsShipped/markSalesOrderStatusAsShipped';
import { MarkSalesOrderStatusAsShippedhandler } from 'src/sales/features/markSalesOrderStatusAsShipped/markSalesOrderStatusAsShipped.handler';
import { SalesOrderRepository } from '../repository/sale-order/sale-order.repository';

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
    InboxMessageRepository,
    markSalesOrderStatusAsPaymentFailed,
    markSalesOrderStatusAsPaymentFailedhandler,
    markSalesOrderStatusAsBilled,
    markSalesOrderStatusAsBilledhandler,
    markSalesOrderStatusAsCancelled,
    markSalesOrderStatusAsCancelledhandler,
    markSalesOrderStatusAsShipped,
    MarkSalesOrderStatusAsShippedhandler,
    SalesOrderRepository,
  ],
})
export class RabbitmqModule {}

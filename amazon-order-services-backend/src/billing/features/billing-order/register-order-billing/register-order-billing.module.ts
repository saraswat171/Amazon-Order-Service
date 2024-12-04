import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterOrderBillingController } from './register-order-billing.controller';

import { RegisterOrderBillingCommand } from './register-order-billing.command';
import { RegisterOrderBillingHandler } from './register-order-billing.handler';
import { OrderBillingRepository } from 'src/billing/infrastructure/repositories/billing-order/billing-order.repository';

@Module({
  imports: [CqrsModule],
  controllers: [RegisterOrderBillingController],
  providers: [
    OrderBillingRepository,
    RegisterOrderBillingCommand,
    RegisterOrderBillingHandler,
  ],
})
export class RegisterOrderBillingModule {}

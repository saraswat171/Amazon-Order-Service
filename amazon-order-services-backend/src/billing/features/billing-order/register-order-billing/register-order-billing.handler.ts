import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterOrderBillingCommand } from './register-order-billing.command';
import { OrderBillingRepository } from 'src/billing/infrastructure/repositories/billing-order/billing-order.repository';

@CommandHandler(RegisterOrderBillingCommand)
export class RegisterOrderBillingHandler
  implements ICommandHandler<RegisterOrderBillingCommand>
{
  constructor(
    @InjectRepository(OrderBillingRepository)
    private readonly repository: OrderBillingRepository,
  ) {}

  async execute(command: RegisterOrderBillingCommand) {
    return await this.repository.registerOrderBilling(command);
  }
}

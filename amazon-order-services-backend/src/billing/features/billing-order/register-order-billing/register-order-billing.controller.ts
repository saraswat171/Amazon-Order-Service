import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterOrderBillingDto } from './register-order-billing.dto';
import { RegisterOrderBillingCommand } from './register-order-billing.command';

@Controller('/api/v1/billing')
export class RegisterOrderBillingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/orders')
  async registerOrderBilling(@Body() registerOrderBillingDto: RegisterOrderBillingDto) {
    const { order_id, billing_account_id, billing_address } = registerOrderBillingDto;

    const command = new RegisterOrderBillingCommand(order_id, billing_account_id, billing_address);

    return this.commandBus.execute(command);
  }
}

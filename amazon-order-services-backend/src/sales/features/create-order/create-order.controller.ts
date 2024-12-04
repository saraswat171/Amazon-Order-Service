import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateOrderDTO } from './create-order.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';

@Controller('/api/v1/sales')
export class CreateOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/orders')
  public async handle(@Body() body: CreateOrderDTO) {
    const { order_id, products, customer_id } = body;
    const command = new CreateOrderCommand(order_id, customer_id, products);

    return this.commandBus.execute(command);
  }
}

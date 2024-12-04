import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrdersHandler } from './orders.service';

@Controller('/api/v1')
export class OrdersController {
  constructor(private readonly handler: OrdersHandler) {}

  @Post('/orders')
  async create(@Body() body: CreateOrderDTO) {
    return await this.handler.handle(body);
  }
}

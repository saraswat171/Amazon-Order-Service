import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateOrderDTO } from './create-order.dto';
import { Response } from 'express';
import { CreateOrderHandler } from './create-order.service';

@Controller('/api/v1/shipping')
export class CreateOrderController {
  constructor(private readonly handler: CreateOrderHandler) {}

  @Post('/orders')
  public async handle(@Body() body: CreateOrderDTO, @Res() res: Response) {
    await this.handler.handle(body);
    return res.status(HttpStatus.CREATED).json({ message: 'Order created' });
  }
}
  
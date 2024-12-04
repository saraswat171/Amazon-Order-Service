import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { PlaceOrderHandler } from './place-order.handler';

@Controller('/api/v1/sales/orders')
export class PlaceOrderController {
  constructor(private readonly handler: PlaceOrderHandler) {}

  @Patch(`/:id/place`)
  public async handle(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.handler.handle(id);
  }
}

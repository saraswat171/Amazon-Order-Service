import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ShippingInboxMessageRepository } from '../../repositories/shipping-inbox-messages/shipping-inbox-messages.repository';
import { Message } from '../common/message.interface';
import { markOrderAsBilled } from 'src/shipping/features/update-order-billed-status/update-order-billed-status.handler';

export class BillingOrderBilled {
  constructor(
    private readonly handler: markOrderAsBilled,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(ShippingInboxMessageRepository)
    private readonly shippingInboxMessageRepository: ShippingInboxMessageRepository,
  ) {}

  getHandlerName(): string {
    return this.constructor.name;
  }

  async handleEvent(payload: Message<any>) {
    console.log('payload:payload ', payload);
    await this.dataSource.transaction(async (transaction) => {
      console.log(
        '------------Message is in the processor of the order Billed',
      );


      await this.handler.handle(payload.body);
      await this.shippingInboxMessageRepository.storeInboxMessage(
        {
          message_id: payload.messageId,
          handler_name: this.getHandlerName(),
        },
        transaction,
      );
    });
    
}
}



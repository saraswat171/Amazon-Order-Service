import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { markSalesOrderStatusAsPlaced } from 'src/sales/domain/order/event/order-placed';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { OutboxMessageRepository } from 'src/sales/infrastructure/repository/sales-outbox-messages/sales-outbox-message.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PlaceOrderHandler {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly SalesOrderRepository: SalesOrderRepository,
    @InjectRepository(OutboxMessageRepository)
    private readonly outboxMessageRepository: OutboxMessageRepository,
    private readonly dataSource: DataSource,
  ) {}

  public async handle(uuid: string) {
    const orderShipped = await this.SalesOrderRepository.findOrderDetails(uuid);
    orderShipped.markInPlaced();

    await this.dataSource.transaction(async (transaction) => {
      const updatedOrderStatus = await this.SalesOrderRepository.createOrder(
        orderShipped,
        transaction,
      );

      await this.outboxMessageRepository.storeOutboxMessage(
        new markSalesOrderStatusAsPlaced(updatedOrderStatus),
        transaction,
      );
    });

    return { message: 'Order placed' };
  }
}

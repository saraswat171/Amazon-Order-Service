import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { SalesOrderRepository } from 'src/sales/infrastructure/repository/sale-order/sale-order.repository';
import { SalesProductRepository } from 'src/sales/infrastructure/repository/sales-products/sales-products.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(SalesOrderRepository)
    private readonly salesOrderRepository: SalesOrderRepository,
    @InjectRepository(SalesProductRepository)
    private readonly salesProductRepository: SalesProductRepository,
  ) {}

  public async execute(payload: CreateOrderCommand) {
    let totalAmount = 0;
    const products = payload?.products;
    for (const product of products) {
      const { product_id, quantity } = product;
      const productData = await this.salesProductRepository.findProduct(product_id);
      if (productData?.price) {
        const amount = productData?.price * quantity;
        totalAmount += amount;
      }
    }
    let newpaylaod = {
      total_amount: totalAmount,
      ...payload,
    };
    await this.salesOrderRepository.createOrder(newpaylaod);
    return { message: 'Order Created' };
  }
}

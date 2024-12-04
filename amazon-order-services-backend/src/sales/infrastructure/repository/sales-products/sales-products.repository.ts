import { Injectable } from '@nestjs/common';
import { Product } from 'src/sales/domain/product/product.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SalesProductRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findProduct(product_id: string) {
    return await this.findOne({
      where: { product_id },
    });
  }

}

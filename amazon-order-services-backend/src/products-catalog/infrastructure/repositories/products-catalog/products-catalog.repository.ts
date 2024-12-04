import { Injectable } from '@nestjs/common';
import { ProductsCatalog } from 'src/products-catalog/domain/products-catalog/products-catalog.entity';
import { ListProduct } from 'src/products-catalog/features/list-products/list-products.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsCatalogRepository extends Repository<ProductsCatalog> {
  constructor(dataSource: DataSource) {
    super(ProductsCatalog, dataSource.createEntityManager());
  }

  async findProducts(payload: ListProduct) {
    const { limit, page } = payload;
    return await this.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

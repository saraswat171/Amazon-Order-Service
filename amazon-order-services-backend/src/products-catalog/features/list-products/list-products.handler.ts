import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductsQuery } from './list-products.query';
import { ProductsCatalogRepository } from 'src/products-catalog/infrastructure/repositories/products-catalog/products-catalog.repository';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<ListProductsQuery> {
  constructor(
    @InjectRepository(ProductsCatalogRepository)
    private readonly repository: ProductsCatalogRepository,
  ) {}

  public async execute(payload: ListProductsQuery) {
    return await this.repository.findProducts(payload);
  }
}

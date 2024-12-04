import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsCatalogRepository } from 'src/products-catalog/infrastructure/repositories/products-catalog/products-catalog.repository';
import { ListProductsQuery } from './list-products.query';
import { ListProductsHandler } from './list-products.handler';
import { ListProductsController } from './list-products.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ListProductsController],
  providers: [
    ProductsCatalogRepository,
    ListProductsQuery,
    ListProductsHandler,
  ],
})
export class ListProductsModule {}

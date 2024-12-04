import { Module } from '@nestjs/common';
import { ListProductsModule } from './features/list-products/list-products.module';

@Module({
  imports: [ListProductsModule],
})
export class ProductsCatalogModules {}

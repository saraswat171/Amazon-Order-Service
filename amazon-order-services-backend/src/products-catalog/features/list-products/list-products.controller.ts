import { Controller, Get, Query } from '@nestjs/common';
import { ListProductsDTO } from './listproducts.dto';
import { QueryBus } from '@nestjs/cqrs';
import { ListProductsQuery } from './list-products.query';

@Controller('/api/v1/products-catalog')
export class ListProductsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/products')
  public async handle(@Query() queryParams: ListProductsDTO) {
    const { limit, page } = queryParams;
    const query = new ListProductsQuery(limit, page);
    return await this.queryBus.execute(query);
  }
}

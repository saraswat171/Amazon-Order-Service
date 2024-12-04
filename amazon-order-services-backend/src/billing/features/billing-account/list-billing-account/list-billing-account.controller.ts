import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { ListBillingAccountDto } from './list-billing-account.dto';
import { ListBillingAccountQuery } from './list-billing-account.query';


@Controller('users')
export class ListBillingAccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/')
  async handle(@Res() response: Response, @Query() reqQuery: ListBillingAccountDto) {
    const query = new ListBillingAccountQuery(reqQuery.limit, reqQuery.page);
    const res = await this.queryBus.execute(query);
    
    if (res && !res.total) {
      return response.status(HttpStatus.NO_CONTENT).send();
    }

    return response.status(HttpStatus.OK).send(res);
  }
}
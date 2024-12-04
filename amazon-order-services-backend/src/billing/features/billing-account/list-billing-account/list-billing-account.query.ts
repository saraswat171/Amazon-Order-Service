export class ListBillingAccountQuery {
    constructor(
      public readonly limit: number,
      public readonly page: number,
    ) {}
  }
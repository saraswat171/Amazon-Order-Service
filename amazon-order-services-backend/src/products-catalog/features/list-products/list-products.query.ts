export class ListProductsQuery {
  constructor(
    public readonly limit: number,
    public readonly page: number,
  ) {}
}

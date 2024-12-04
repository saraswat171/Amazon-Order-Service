export class RegisterOrderBillingCommand {
  constructor(
    public readonly order_id: string,
    public readonly billing_account_id: string,
    public readonly billing_address: string,
  ) {}
}

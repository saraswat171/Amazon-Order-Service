import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RegisterOrderBillingDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  billing_account_id: string;

  @IsString()
  @IsNotEmpty()
  billing_address: string;
}

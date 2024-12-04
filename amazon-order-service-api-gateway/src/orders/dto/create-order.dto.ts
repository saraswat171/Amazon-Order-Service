import {
  IsUUID,
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDTO {
  @IsUUID()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO {
  @IsUUID()
  order_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products: ProductDTO[];

  @IsUUID()
  customer_id: string;

  @IsUUID()
  billing_account_id: string;

  @IsString()
  billing_address: string;

  @IsString()
  shipping_address: string;
}

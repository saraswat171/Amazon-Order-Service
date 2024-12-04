import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Product {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsUUID()
  order_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[];

  @IsNotEmpty()
  @IsUUID()
  customer_id: string;
}

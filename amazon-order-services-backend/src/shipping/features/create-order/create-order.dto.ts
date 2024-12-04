import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsString, IsInt, Min, IsArray, ValidateNested } from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsUUID()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  shipping_address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products: ProductDTO[];
}
class ProductDTO {
  @IsUUID()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;


}
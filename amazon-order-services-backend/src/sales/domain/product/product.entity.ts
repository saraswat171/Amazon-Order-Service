import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sales_product')
export class Product {
  @PrimaryColumn({ type: 'uuid', unique: true })
  product_id: string;

  @Column({ type: 'int', nullable: false })
  price: number;
}

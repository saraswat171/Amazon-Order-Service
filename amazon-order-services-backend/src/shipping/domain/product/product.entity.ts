import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('shipping_product')
export class ShippingProduct {
  @PrimaryColumn({ type: 'uuid', unique: true })
  product_id: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;
}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('products_catalog') // Specify the table name
export class ProductsCatalog {
  @PrimaryColumn('uuid')
  product_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_url: string;
}

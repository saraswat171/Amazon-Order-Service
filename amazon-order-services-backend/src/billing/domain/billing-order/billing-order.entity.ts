import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('billing_order')
export class BillingOrder {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  order_id: string;

  @Column({ type: 'uuid', nullable: false })
  billing_account_id: string;

  @Column({ type: 'varchar', nullable: false })
  billing_address: string;
}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('billing_account')
export class BillingAccount {
  @Column({ type: 'float', nullable: false })
  balance: number;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  billing_account_id: string;

  @Column({ type: 'varchar', nullable: false })
  card_number: string;
}

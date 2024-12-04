import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('shipping_order')
export class ShippingOrder {
    @PrimaryColumn({ type: 'uuid', unique: true })
    order_id: string;

    @Column({ type: 'varchar', nullable: false })
    shipping_address: string;

    @Column({ type: 'jsonb', nullable: true })
    products: { product_id: string; quantity: number }[];

    @Column({ type: 'boolean', default: false })
    is_placed: boolean;
  
    @Column({ type: 'boolean', default: false })
    is_billed: boolean;
    
    
    markOrderPlaced() {
        this.is_placed = true;
      }
    
      markOrderBilled() {
        this.is_billed = true;
      }
    }
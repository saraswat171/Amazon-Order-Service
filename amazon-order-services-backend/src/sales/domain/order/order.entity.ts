import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { OrderStatus } from "./enums/order-status.enum";

@Entity('sales_order')
export class SalesOrder {
    @PrimaryColumn({ type: 'uuid', unique: true })
    order_id: string;

    @Column({ type: 'jsonb', nullable: false })
    products: { product_id: string; quantity: number }[];

    @Column({ type: 'uuid', nullable: false })
    customer_id: string;

    @Column({ type: 'int', nullable: false })
    total_amount: number

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    markInPlaced() {
        this.status = OrderStatus.PLACED;
      }
    
      markAsPaymentFailed() {
        this.status = OrderStatus.PAYMENT_FAILED;
      }

      markAsCancelled() {
        this.status = OrderStatus.CANCELLED;
      }

      markAsBilled() {
        this.status = OrderStatus.BILLED;
      }

      markAsReadyToShip() {
        this.status = OrderStatus.READY_TO_SHIP;
      }

}
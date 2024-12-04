import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('shipping_inbox_message')
  @Unique('unique_message_handler', ['message_id', 'handler_name'])
  export class ShippingInboxMessage {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ type: 'uuid' })
    message_id: string;
  
    @Column({ type: 'varchar' })
    handler_name: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    handle_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  }
  
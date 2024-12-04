import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSalesShippingTable1732047036054 implements MigrationInterface {
  name = 'CreateSalesShippingTable1732047036054';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipping_order',
        columns: [
          {
            name: 'order_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'shipping_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'products',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'is_placed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_billed',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales_shipping');
  }
}

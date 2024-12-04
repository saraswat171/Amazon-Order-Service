import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSalesProductTable1732047036056 implements MigrationInterface {
  name = 'CreateSalesProductTable1732047036056';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipping_product',
        columns: [
          {
            name: 'product_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shipping_product');
  }
}

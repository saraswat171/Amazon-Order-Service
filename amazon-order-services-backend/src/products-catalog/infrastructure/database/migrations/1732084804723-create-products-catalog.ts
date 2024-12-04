import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsCatalog1732084804723 implements MigrationInterface {
  name = 'CreateProductsCatalog1732084804723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products_catalog',
        columns: [
          {
            name: 'product_id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'product_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products_catalog');
  }
}

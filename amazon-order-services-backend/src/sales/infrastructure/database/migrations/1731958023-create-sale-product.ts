import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSalesProductTable1687123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'sales_product',
                columns: [
                    {
                        name: 'product_id',
                        type: 'uuid',
                        isPrimary: true,
                        isUnique: true,
                    },
                    {
                        name: 'price',
                        type: 'numeric',
                        isNullable: false,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('product');
    }
}

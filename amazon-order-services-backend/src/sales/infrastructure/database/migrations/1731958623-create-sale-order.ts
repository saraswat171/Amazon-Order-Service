import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateSalesOrderTable1687123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "order_status_enum" AS ENUM (
                'pending',
                'placed',
                'billed',
                'payment_failed',
                'ready_to_ship',
                'cancelled'
            )
        `);

        await queryRunner.createTable(
            new Table({
                name: 'sales_order',
                columns: [
                    {
                        name: 'order_id',
                        type: 'uuid',
                        isPrimary: true,
                        isUnique: true,
                    },
                    {
                        name: 'products',
                        type: 'jsonb',
                        isNullable: false,
                    },
                    {
                        name: 'customer_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'total_amount',
                        type: 'numeric',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'status',
                        type: 'order_status_enum',
                        default: `'pending'`,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sales_order');
        await queryRunner.query(`DROP TYPE "order_status_enum"`);
    }
}

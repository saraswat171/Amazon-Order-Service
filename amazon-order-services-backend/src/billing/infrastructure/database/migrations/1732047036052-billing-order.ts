import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBillingOrder1732047036052 implements MigrationInterface {
  name = 'CreateBillingOrder1732047036052';

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Create the "billing_order" table
    await queryRunner.createTable(
      new Table({
        name: 'billing_order',
        columns: [
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'billing_account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'billing_address',
            type: 'varchar',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "billing_order" table
    await queryRunner.dropTable('billing_order');
  }
}

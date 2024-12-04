import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBillingAccount1732047036053 implements MigrationInterface {
  name = 'CreateBillingAccount1732047036053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'billing_account',
        columns: [
          {
            name: 'billing_account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'balance',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'card_number',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('billing_account');
  }
}

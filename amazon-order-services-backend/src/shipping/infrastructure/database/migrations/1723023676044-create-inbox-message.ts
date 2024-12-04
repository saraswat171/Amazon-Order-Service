import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateBillingInboxMessage1723023676044 implements MigrationInterface {
  name = 'CreateInboxMessage1723023676044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipping_inbox_message',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'message_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'handler_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'handle_at',
            type: 'TIMESTAMP',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'TIMESTAMP',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'shipping_inbox_message',
      new TableUnique({
        name: 'unique_index',
        columnNames: ['message_id', 'handler_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('shipping_inbox_message', 'unique_index');
    await queryRunner.dropTable('shipping_inbox_message');
  }
}

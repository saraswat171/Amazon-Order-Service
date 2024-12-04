import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateInboxMessage1731999604862 implements MigrationInterface {
  name = 'CreateInboxMessage1731999604862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "inbox_message" table
    await queryRunner.createTable(
      new Table({
        name: 'sales_inbox_message',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            generationStrategy: 'increment',
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
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create unique constraint on "message_id" and "handler_name"
    await queryRunner.createUniqueConstraint(
      'sales_inbox_message',
      new TableUnique({
        name: 'unique_sales_message_handler',
        columnNames: ['message_id', 'handler_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'sales_inbox_message',
      'unique_sales_message_handler',
    );

    await queryRunner.dropTable('sales_inbox_message');
  }
}

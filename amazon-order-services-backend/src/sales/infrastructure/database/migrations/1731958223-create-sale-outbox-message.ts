import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOutboxMessage1731999767833 implements MigrationInterface {
  name = 'CreateOutboxMessage1731999767833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "outbox_message" table
    await queryRunner.createTable(
      new Table({
        name: 'sales_outbox_message',
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
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'headers',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'properties',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'SENT', 'FAILED'],
            default: `'PENDING'`,
            isNullable: false,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
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
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropTable('sales_outbox_message');
  }
}

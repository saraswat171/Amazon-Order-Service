import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();

const dropDatabase = async (configService: ConfigService) => {
  const dbName = configService.get<string>('DB_DATABASE');
  const client = new Client({
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
  });

  try {
    await client.connect();
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    );

    if (res.rowCount > 0) {
      await client.query(`DROP DATABASE ${dbName}`);
      console.log(`Database '${dbName}' dropped successfully.`);
    } else {
      console.log(`Database '${dbName}' does not exist.`);
    }
  } catch (error) {
    console.error('Error checking or dropping database:', error.message);
  } finally {
    await client.end();
  }
};

dropDatabase(new ConfigService()).catch((error) => console.error(error));

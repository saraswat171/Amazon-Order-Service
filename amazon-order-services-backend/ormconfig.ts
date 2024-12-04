import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

require('dotenv').config();

export const dataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [
    'dist/src/billing/domain/**/*.entity.js',
    'dist/src/products-catalog/domain/**/*.entity.js',
    'dist/src/sales/domain/**/*.entity.js',
    'dist/src/shipping/domain/**/*.entity.js'
  ],
  migrationsTableName: 'migrations',
  migrations: [
    'dist/src/billing/infrastructure/database/migrations/*.js',
    'dist/src/products-catalog/infrastructure/database/migrations/*.js',
    'dist/src/sales/infrastructure/database/migrations/*.js',
    'dist/src/shipping/infrastructure/database/migrations/*.js'
  ],
  seeds: [
    'dist/src/products-catalog/infrastructure/database/seeders/*.js',
    'dist/src/sales/infrastructure/database/seeders/*.js',
    'dist/src/billing/infrastructure/database/seeders/*.js',
    'dist/src/shipping/infrastructure/database/seeders/*.js'
  ],
  seedTracking: true,
});

export const dataSource = new DataSource(
  dataSourceOptions(new ConfigService()),
);

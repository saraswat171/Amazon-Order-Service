import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'ormconfig';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        dataSourceOptions(configService),
      inject: [ConfigService],
    }),
  ],
})
export class TypeOrmModule {}
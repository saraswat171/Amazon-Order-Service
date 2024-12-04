import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from './common/typeorm';
import { BillingModule } from './billing/billing.module';
import { SalesModule } from './sales/sales.module';
import { ShippingModule } from './shipping/shipping.module';
import { ProductsCatalogModules } from './products-catalog/products-catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    BillingModule,
    SalesModule,
    ShippingModule,
    ProductsCatalogModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

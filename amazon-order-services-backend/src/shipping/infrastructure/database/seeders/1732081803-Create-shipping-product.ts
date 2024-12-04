import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { StorageFileHandler } from 'src/infrastructure/storage/file-storage.service';
import { ConfigService } from '@nestjs/config';
import { DriveConfigurationService } from 'src/infrastructure/storage/drive-config';
import { ShippingProduct } from 'src/shipping/domain/product/product.entity';

export default class ShippingProductSeeder implements Seeder {
  private storageFileHandler: StorageFileHandler;
  private configService: ConfigService;
  private programsSeedFilePath: string;
  private fileName: string = 'shipping_product.json';
  constructor() {
    this.storageFileHandler = new StorageFileHandler(
      new ConfigService(),
      new DriveConfigurationService(),
    );
    this.configService = new ConfigService();
    this.programsSeedFilePath =
      this.configService.get<string>('SEED_FILES_PATH') + this.fileName;
  }
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(ShippingProduct);
    const programs = await this.storageFileHandler.getFile(
      this.programsSeedFilePath,
    );
    await repository.insert(programs);
  }
}

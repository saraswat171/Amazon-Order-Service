import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { StorageFileHandler } from '../../storage/file-storage.service';
import { DriveConfigurationService } from '../../storage/drive-config';
import { Product } from 'src/sales/domain/product/product.entity';


export default class SalesProductSeeder implements Seeder {
  private readonly storageFileHandler: StorageFileHandler;
  private readonly configService: ConfigService;
  private readonly productSeedFilePath: string;
  private readonly fileName: string = 'sales_products.json';
  constructor() {
    this.storageFileHandler = new StorageFileHandler(
      new ConfigService(),
      new DriveConfigurationService(),
    );
    this.configService = new ConfigService();
    this.productSeedFilePath =
      this.configService.get<string>('SEED_FILES_PATH') + this.fileName;
  }
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Product);
    const programs = await this.storageFileHandler.getFile(
      this.productSeedFilePath,
    );
    await repository.insert(programs);
  }
}

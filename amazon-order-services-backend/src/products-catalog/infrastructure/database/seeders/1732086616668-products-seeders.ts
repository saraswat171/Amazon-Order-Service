import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductsCatalog } from 'src/products-catalog/domain/products-catalog/products-catalog.entity';
import { StorageFileHandler } from 'src/infrastructure/storage/file-storage.service';
import { DriveConfigurationService } from 'src/infrastructure/storage/drive-config';

export default class ProductsCatalogSeeder implements Seeder {
  private readonly storageFileHandler: StorageFileHandler;
  private readonly configService: ConfigService;
  private readonly programsSeedFilePath: string;
  private readonly fileName: string = 'catalog_products.json';
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
    const repository = dataSource.getRepository(ProductsCatalog);
    const programs = await this.storageFileHandler.getFile(
      this.programsSeedFilePath,
    );
    await repository.insert(programs);
  }
}

import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { StorageFileHandler } from 'src/infrastructure/storage/file-storage.service';
import { ConfigService } from '@nestjs/config';
import { DriveConfigurationService } from 'src/infrastructure/storage/drive-config';
import { BillingAccount } from 'src/billing/domain/billing-account/billing-account.entity';

export default class BillingAccountsSeeder implements Seeder {
  private readonly storageFileHandler: StorageFileHandler;
  private readonly configService: ConfigService;
  private readonly programsSeedFilePath: string;
  private readonly fileName: string = 'billing_accounts.json';
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
    const repository = dataSource.getRepository(BillingAccount);
    const programs = await this.storageFileHandler.getFile(
      this.programsSeedFilePath,
    );
    await repository.insert(programs);
  }
}

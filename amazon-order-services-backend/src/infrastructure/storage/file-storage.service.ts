import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriveConfigurationService } from './drive-config';

@Injectable()
export class StorageFileHandler {
  private readonly driveManager;
  private readonly storageType: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly driveConfigService: DriveConfigurationService,
  ) {
    this.driveManager = this.driveConfigService.getDriveManager();
    this.storageType = this.configService.get<string>('FILESYSTEM_DISK');
  }

  public async getFile(fileName: string): Promise<any> {
    const drive = this.driveManager.disk(this.storageType);
    const fileContent = await drive.get(fileName);
    return JSON.parse(fileContent.raw.toString());
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageManager, LocalFileSystemStorage } from '@slynova/flydrive';
import { GoogleCloudStorage } from '@slynova/flydrive-gcs';
import { resolve } from 'path';

@Injectable()
export class DriveConfigurationService {
  private readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }
  public getDriveManager(): StorageManager {
    const storage = new StorageManager({
      default: this.configService.get<string>('FILESYSTEM_DISK'),
      disks: {
        local: {
          driver: 'local',
          config: {
            root: './src/infrastructure/static',
            publicUrl: '/static',
          },
        },
        gcs: {
          driver: 'gcs',
          config: {
            keyFilename: resolve(
              this.configService.get<string>('GCP_CREDENTIALS_PATH'),
            ),
            bucket: this.configService.get<string>('GCP_BUCKET_NAME'),
          },
        },
      },
    });

    storage.registerDriver('local', LocalFileSystemStorage);
    storage.registerDriver('gcs', GoogleCloudStorage);

    return storage;
  }
}

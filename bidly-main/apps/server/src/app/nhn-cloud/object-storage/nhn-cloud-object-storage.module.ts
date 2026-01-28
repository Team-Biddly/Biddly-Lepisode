import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { NHNCloudObjectStorageModuleConfig } from './nhn-cloud-object-storage.module.type';
import { NHNCloudObjectStorageService } from './nhn-cloud-object-storage.service';
import { NHN_CLOUD_OBJECT_STORAGE_MODULE_CONFIG } from './nhn-cloud-object-storage.module.const';

@Module({})
export class NHNCloudObjectStorageModule {
  static forFeature(options: NHNCloudObjectStorageModuleConfig): DynamicModule {
    return {
      module: NHNCloudObjectStorageModule,
      imports: [HttpModule],
      providers: [
        {
          provide: NHN_CLOUD_OBJECT_STORAGE_MODULE_CONFIG,
          useValue: options,
        },
        NHNCloudObjectStorageService,
      ],
      exports: [NHNCloudObjectStorageService],
    };
  }
}

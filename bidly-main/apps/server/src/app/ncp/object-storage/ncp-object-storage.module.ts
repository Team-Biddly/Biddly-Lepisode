import { DynamicModule, Module } from "@nestjs/common";
import { NCPObjectStorageService } from "./ncp-object-storage.service";
import { NCP_OBJECT_STORAGE_MODULE_CONFIG } from "./ncp-object-storage.const";
import { NCPObjectStorageModuleConfig } from "./ncp-object-storage.module.type";

@Module({})
export class NCPObjectStorageModule {
  static forFeature(options: NCPObjectStorageModuleConfig): DynamicModule {
    return {
      module: NCPObjectStorageModule,
      providers: [
        { provide: NCP_OBJECT_STORAGE_MODULE_CONFIG, useValue: options },
        NCPObjectStorageService,
      ],
      exports: [NCPObjectStorageService],
    };
  }
}

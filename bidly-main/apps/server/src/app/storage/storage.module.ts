import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { STORAGE_MODULE_CONFIG } from './storage.module.const';
import { StorageModuleConfig } from './storage.module.type';
import { StorageService } from './storage.service';

@Module({})
export class StorageModule {
    static forRoot(options: StorageModuleConfig): DynamicModule {
        return {
            module: StorageModule,
            global: true,
            imports: [HttpModule],
            controllers: [StorageController],
            providers: [
                {
                    provide: STORAGE_MODULE_CONFIG,
                    useValue: options,
                },
                StorageService,
            ],
            exports: [StorageService],
        };
    }
}

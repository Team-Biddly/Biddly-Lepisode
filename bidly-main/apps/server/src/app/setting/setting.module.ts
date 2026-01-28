import { DynamicModule, Module } from '@nestjs/common';
import { DateUtil } from '../../libs/util/date.util';
import { SettingController } from './setting.controller';
import { SETTING_MODULE_CONFIG } from './setting.module.const';
import { SettingModuleConfig } from './setting.module.type';
import { SettingService } from './setting.service';

@Module({})
export class SettingModule {
  static forRoot(options?: SettingModuleConfig): DynamicModule {
    return {
      module: SettingModule,
      global: true,
      providers: [
        {
          provide: SETTING_MODULE_CONFIG,
          useValue: options,
        },
        SettingService,
        DateUtil,
      ],
      controllers: [SettingController],
      exports: [SettingService, DateUtil],
    };
  }
}

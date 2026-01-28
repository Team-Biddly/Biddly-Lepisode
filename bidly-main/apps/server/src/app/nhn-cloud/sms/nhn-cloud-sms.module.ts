import { DynamicModule, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { NHNCloudSMSModuleConfig } from "./nhn-cloud-sms.module.type";
import { NHN_CLOUD_SMS_MODULE_CONFIG } from "./nhn-cloud-sms.module.const";
import { NHNCloudSmsService } from "./nhn-cloud-sms.service";

@Module({})
export class NHNCloudSmsModule {
  static forFeature(option: NHNCloudSMSModuleConfig): DynamicModule {
    return {
      module: NHNCloudSmsModule,
      imports: [HttpModule],
      providers: [
        {
          provide: NHN_CLOUD_SMS_MODULE_CONFIG,
          useValue: option,
        },
        NHNCloudSmsService,
      ],
      exports: [NHNCloudSmsService],
    };
  }
}

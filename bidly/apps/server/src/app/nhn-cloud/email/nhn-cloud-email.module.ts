import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module } from "@nestjs/common";
import { NHNCloudEmailService } from "./nhn-cloud-email.service";
import { NHNCloudEmailModuleConfig } from "./nhn-cloud-email.module.type";
import { NHN_CLOUD_EMAIL_MODULE_CONFIG } from "./nhn-cloud-email.module.const";

@Module({})
export class NHNCloudEmailModule {
  static forFeature(option: NHNCloudEmailModuleConfig): DynamicModule {
    return {
      module: NHNCloudEmailModule,
      imports: [HttpModule],
      providers: [
        {
          provide: NHN_CLOUD_EMAIL_MODULE_CONFIG,
          useValue: option,
        },
        NHNCloudEmailService,
      ],
      exports: [NHNCloudEmailService],
    };
  }
}

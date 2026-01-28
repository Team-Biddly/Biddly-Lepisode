import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module } from "@nestjs/common";
import { NCPSmsModule } from "../ncp/sms/ncp-sms.module";
import { NHNCloudSmsModule } from "../nhn-cloud/sms/nhn-cloud-sms.module";
import { SMS_MODULE_OPTIONS } from "./sms.module.const";
import { SMSModuleConfig } from "./sms.module.type";
import { SmsService } from "./sms.service";

@Module({})
export class SmsModule {
  static forRoot(options: SMSModuleConfig): DynamicModule {
    const imports: any[] = [HttpModule];

    switch (options.provider) {
      case "naver-cloud-platform":
        imports.push(NCPSmsModule.forFeature(options.config));
        break;
      case "nhn-cloud":
        imports.push(NHNCloudSmsModule.forFeature(options.config));
        break;
    }

    return {
      module: SmsModule,
      global: true,
      imports,
      providers: [
        {
          provide: SMS_MODULE_OPTIONS,
          useValue: options,
        },
        SmsService,
      ],
      exports: [SmsService],
    };
  }
}

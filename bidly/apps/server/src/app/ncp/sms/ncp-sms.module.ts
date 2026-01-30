import { DynamicModule, Module } from "@nestjs/common";
import { NCP_SMS_MODULE_OPTIONS } from "./ncp-sms.const";
import { NCPSmsService } from "./ncp-sms.service";
import { HttpModule } from "@nestjs/axios";
import { NCPSMSModuleConfig } from "./ncp-sms.module.type";

@Module({})
export class NCPSmsModule {
  static forFeature(options: NCPSMSModuleConfig): DynamicModule {
    return {
      module: NCPSmsModule,
      imports: [HttpModule],
      providers: [
        {
          provide: NCP_SMS_MODULE_OPTIONS,
          useValue: options,
        },
        NCPSmsService,
      ],
      exports: [NCPSmsService],
    };
  }
}

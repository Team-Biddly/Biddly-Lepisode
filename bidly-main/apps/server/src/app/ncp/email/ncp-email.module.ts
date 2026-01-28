import { DynamicModule, Module } from "@nestjs/common";
import { NCPEmailService } from "./ncp-email.service";
import { NCP_CLOUD_EMAIL_MODULE_CONFIG } from "./ncp-email.module.const";
import { HttpModule } from "@nestjs/axios";
import { NCPEmailModuleConfig } from "./ncp-email.module.type";

@Module({})
export class NCPEmailModule {
  static forFeature(option: NCPEmailModuleConfig): DynamicModule {
    return {
      module: NCPEmailModule,
      imports: [HttpModule],
      providers: [
        {
          provide: NCP_CLOUD_EMAIL_MODULE_CONFIG,
          useValue: option,
        },
        NCPEmailService,
      ],
      exports: [NCPEmailService],
    };
  }
}

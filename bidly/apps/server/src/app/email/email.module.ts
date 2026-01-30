import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailModuleConfig } from "./email.module.type";
import { NCPEmailModule } from "../ncp/email/ncp-email.module";
import { NHNCloudEmailModule } from "../nhn-cloud/email/nhn-cloud-email.module";
import { EMAIL_MODULE_CONFIG } from "./email.module.const";

@Module({})
export class EmailModule {
  static forRoot(options: EmailModuleConfig): DynamicModule {
    const imports: any[] = [HttpModule];

    switch (options.provider) {
      case "naver-cloud-platform":
        imports.push(NCPEmailModule.forFeature(options.config));
        break;
      case "nhn-cloud":
        imports.push(NHNCloudEmailModule.forFeature(options.config));
        break;
    }

    return {
      module: EmailModule,
      global: true,
      imports,
      providers: [
        {
          provide: EMAIL_MODULE_CONFIG,
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}

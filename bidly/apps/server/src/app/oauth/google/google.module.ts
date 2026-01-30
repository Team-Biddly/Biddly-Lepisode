import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GoogleAuthController } from "./google.controller";
import { GOOGLE_AUTH_MODULE_CONFIG } from "./google.module.const";
import { GoogleAuthModuleConfig } from "./google.module.type";
import { GoogleAuthService } from "./google.service";

@Module({})
export class GoogleAuthModule {
  static forFeature(option: GoogleAuthModuleConfig) {
    return {
      module: GoogleAuthModule,
      imports: [HttpModule],
      controllers: [GoogleAuthController],
      providers: [
        {
          provide: GOOGLE_AUTH_MODULE_CONFIG,
          useValue: option,
        },
        GoogleAuthService,
      ],
      exports: [GoogleAuthService],
    };
  }
}

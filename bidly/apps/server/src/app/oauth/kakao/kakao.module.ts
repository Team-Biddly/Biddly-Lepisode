import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KakaoAuthController } from './kakao.controller';
import { KAKAO_AUTH_MODULE_CONFIG } from './kakao.module.const';
import { KakaoAuthModuleConfig } from './kakao.module.type';
import { KakaoService } from './kakao.service';

@Module({})
export class KakaoAuthModule {
  static forFeature(option: KakaoAuthModuleConfig) {
    return {
      module: KakaoAuthModule,
      imports: [HttpModule],
      controllers: [KakaoAuthController],
      providers: [
        {
          provide: KAKAO_AUTH_MODULE_CONFIG,
          useValue: option,
        },
        KakaoService,
      ],
      exports: [KakaoService],
    };
  }
}

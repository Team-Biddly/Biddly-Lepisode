import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { GoogleAuthModule } from './google/google.module';
import { OauthController } from './oauth.controller';
import { OAuthModuleConfig } from './oauth.module.type';
import { OauthService } from './oauth.service';
import { KakaoAuthModule } from './kakao/kakao.module';

@Module({})
export class OAuthModule {
  static forRoot(option: OAuthModuleConfig): DynamicModule {
    const imports: any[] = [HttpModule];

    if (option.providers.google) {
      imports.push(GoogleAuthModule.forFeature(option.providers.google));
    }

    if (option.providers.kakao) {
      imports.push(KakaoAuthModule.forFeature(option.providers.kakao));
    }

    return {
      module: OAuthModule,
      imports,
      controllers: [OauthController],
      providers: [OauthService],
      exports: [OauthService],
    };
  }
}

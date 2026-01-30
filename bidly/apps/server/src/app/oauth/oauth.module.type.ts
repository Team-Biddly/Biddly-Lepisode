import { GoogleAuthModuleConfig } from './google/google.module.type';
import { KakaoAuthModuleConfig } from './kakao/kakao.module.type';

export type OAuthModuleConfig = {
  providers: {
    google?: GoogleAuthModuleConfig;
    kakao?: KakaoAuthModuleConfig;
  };
};

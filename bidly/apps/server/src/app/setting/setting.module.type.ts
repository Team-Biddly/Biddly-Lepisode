import { OptionalSettings, PrivacySetting } from './setting.const';

export type SettingModuleConfig = {
  /**
   * 기본 설정값을 변경합니다.
   * @see {Settings} 기본 설정값
   */
  settings?: OptionalSettings;

  /**
   * 시간 설정과 관련된 스케쥴러를 비활성화합니다.
   * `settings`에 정의된 시간 설정값은 무시됩니다.
   * @default false
   */
  disabled?: {
    [key in keyof PrivacySetting]?: boolean;
  };
};

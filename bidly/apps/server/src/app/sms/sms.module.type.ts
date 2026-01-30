import { NCPSMSModuleConfig } from "../ncp/sms/ncp-sms.module.type";
import { NHNCloudSMSModuleConfig } from "../nhn-cloud/sms/nhn-cloud-sms.module.type";

export type SMSModuleConfig =
  | SmsModuleConfigWithNHNCloud
  | SmsModuleConfigWithNCP;

export type SmsModuleConfigWithNHNCloud = {
  provider: "nhn-cloud";
  config: NHNCloudSMSModuleConfig;
};

export type SmsModuleConfigWithNCP = {
  provider: "naver-cloud-platform";
  config: NCPSMSModuleConfig;
};

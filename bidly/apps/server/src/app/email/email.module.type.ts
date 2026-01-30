import { NCPEmailModuleConfig } from "../ncp/email/ncp-email.module.type";
import { NHNCloudEmailModuleConfig } from "../nhn-cloud/email/nhn-cloud-email.module.type";

export type EmailModuleConfig =
  | EmailModuleConfigWithNHNCloud
  | EmailModuleConfigWithNCP;

export type EmailModuleConfigWithNHNCloud = {
  provider: "nhn-cloud";
  config: NHNCloudEmailModuleConfig;
};

export type EmailModuleConfigWithNCP = {
  provider: "naver-cloud-platform";
  config: NCPEmailModuleConfig;
};

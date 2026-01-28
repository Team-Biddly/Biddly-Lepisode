import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NHNCloudCommonResponse } from '../nhn-common-response.dto';
import { NHN_CLOUD_SMS_MODULE_CONFIG } from './nhn-cloud-sms.module.const';
import { NHNCloudSMSModuleConfig } from './nhn-cloud-sms.module.type';
import {
  NHNCloudSMSRequest,
  NHNCloudSMSRequestResponse,
} from './nhn-cloud-sms.type';

@Injectable()
export class NHNCloudSmsService {
  private readonly endpoint = 'https://api-sms.cloud.toast.com/sms/v3.0';
  private readonly appKey = this.config.appKey;
  private readonly secretKey = this.config.secretKey;
  private readonly sendNo = this.config.sendNo;

  get baseUrl(): string {
    return `${this.endpoint}/appKeys/${this.appKey}`;
  }

  get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Secret-Key': this.secretKey,
    };
  }

  constructor(
    @Inject(NHN_CLOUD_SMS_MODULE_CONFIG)
    private readonly config: NHNCloudSMSModuleConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * SMS를 전송합니다.
   * @author 최강훈 <ganghun@lepisode.team>
   * @see  https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide/#sms_7
   */
  send(body: NHNCloudSMSRequest): Promise<NHNCloudSMSRequestResponse> {
    return new Promise<NHNCloudSMSRequestResponse>((resolve, reject) => {
      this.httpService
        .post<NHNCloudCommonResponse<NHNCloudSMSRequestResponse>>(
          `${this.baseUrl}/sender/sms`,
          { ...body, sendNo: this.sendNo },
          {
            headers: this.headers,
          },
        )
        .subscribe({
          next: (res) => {
            if (res.data.header.isSuccessful) {
              Logger.log(`✅ SMS 발송에 성공했습니다.`);
              resolve(res.data.body.data);
            } else {
              Logger.error(`⛔️ SMS 발송에 실패했습니다.`);
              reject(res.data.header);
            }
          },
        });
    });
  }
}

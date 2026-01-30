import { Inject, Injectable, Logger } from "@nestjs/common";
import { NCP_SMS_MODULE_OPTIONS } from "./ncp-sms.const";
import { NCPSMSModuleConfig } from "./ncp-sms.module.type";
import { NCPSMSSendRequest, NCPSMSSendResponse } from "./ncp-sms.type";
import hmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class NCPSmsService {
  private readonly logger = new Logger(NCPSmsService.name);

  private readonly baseUrl = "https://sens.apigw.ntruss.com/sms/v2/services";

  constructor(
    @Inject(NCP_SMS_MODULE_OPTIONS)
    private readonly options: NCPSMSModuleConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 메시지 발송
   * @description 메시지를 발송합니다.
   * @see https://api.ncloud-docs.com/docs/ai-application-service-sens-smsv2#%EB%A9%94%EC%8B%9C%EC%A7%80-%EB%B0%9C%EC%86%A1
   * @author 최강훈 <ganghun@lepisode.team>
   */
  send(request: Omit<NCPSMSSendRequest, "from">): Promise<NCPSMSSendResponse> {
    const headers = this.getHeaders(
      "POST",
      `/sms/v2/services/${this.options.serviceId}/messages`,
    );

    return new Promise<NCPSMSSendResponse>((resolve, reject) => {
      this.httpService
        .post<NCPSMSSendResponse>(
          `${this.baseUrl}/${this.options.serviceId}/messages`,
          { ...request, from: this.options.sendNo },
          {
            headers,
          },
        )
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (err) => {
            this.logger.error(
              "SMS 발송 중 오류가 발생했습니다.",
              err.response.data,
            );
            reject(err);
          },
        });
    });
  }

  private getHeaders(method: string, uri: string): Record<string, any> {
    const timestamp = new Date().getTime();
    return {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": this.options.accessKey,
      "x-ncp-apigw-signature-v2": this.getSignature(method, uri, timestamp),
    };
  }

  /**
   * API 호출에 필요한 서명을 생성합니다.
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private getSignature(method: string, uri: string, timestamp: number): string {
    const payload = `${method} ${uri.startsWith("/") ? uri : `/${uri}`}\n${timestamp}\n${this.options.accessKey}`;
    const hmac = hmacSHA256(payload, this.options.secretKey);
    return Base64.stringify(hmac);
  }
}

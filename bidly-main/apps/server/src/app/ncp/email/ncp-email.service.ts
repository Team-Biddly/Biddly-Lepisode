import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import Base64 from "crypto-js/enc-base64";
import hmacSHA256 from "crypto-js/hmac-sha256";
import { NCP_CLOUD_EMAIL_MODULE_CONFIG } from "./ncp-email.module.const";
import { NCPEmailModuleConfig } from "./ncp-email.module.type";
import { NCPSendMailRequest } from "./types/create-mail-request-request.type";
import { CreateMailRequestResponse } from "./types/create-mail-request-response.type";

@Injectable()
export class NCPEmailService {
  private readonly logger = new Logger(NCPEmailService.name);

  private readonly endpoint = "https://mail.apigw.ntruss.com/api/v1";

  accessKey = this.config.accessKey;
  secretKey = this.config.secretKey;
  sender = this.config.sender;
  senderName = this.config.senderName;

  constructor(
    @Inject(NCP_CLOUD_EMAIL_MODULE_CONFIG)
    private readonly config: NCPEmailModuleConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 메일 전송을 요청합니다.
   * @see https://api.ncloud-docs.com/docs/ai-application-service-cloudoutboundmailer-createmailrequest
   * @author 최강훈 <ganghun@lepisode.team>
   */
  send(data: NCPSendMailRequest): Promise<CreateMailRequestResponse> {
    return new Promise<CreateMailRequestResponse>((resolve, reject) => {
      this.httpService
        .post<CreateMailRequestResponse>(
          `${this.endpoint}/mails`,
          {
            ...data,
            senderAddress: this.sender,
            senderName: this.senderName,
          },
          {
            headers: this.getHeaders("POST", "/mails"),
          },
        )
        .subscribe({
          next: (response) => {
            this.logger.log("이메일 전송 요청을 성공했습니다.");
            resolve(response.data);
          },
          error: (error) => {
            this.logger.error(
              "이메일 전송 요청을 실패했습니다.",
              error.response.data,
            );
            reject(error);
          },
        });
    });
  }

  /**
   * API 호출에 필요한 헤더를 생성합니다.
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private getHeaders(method: string, uri: string) {
    const timestamp = new Date().getTime();
    return {
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": this.accessKey,
      "x-ncp-apigw-signature-v2": this.getSignature(method, uri, timestamp),
      "x-ncp-lang": "ko-KR",
    };
  }

  /**
   * API 호출에 필요한 서명을 생성합니다.
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private getSignature(method: string, uri: string, timestamp: number): string {
    const payload = `${method} /api/v1${uri.startsWith("/") ? uri : `/${uri}`}\n${timestamp}\n${this.accessKey}`;
    const hmac = hmacSHA256(payload, this.secretKey);
    return Base64.stringify(hmac);
  }
}

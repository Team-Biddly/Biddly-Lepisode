import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NHN_CLOUD_EMAIL_MODULE_CONFIG } from './nhn-cloud-email.module.const';
import { NHNCloudEmailModuleConfig } from './nhn-cloud-email.module.type';

@Injectable()
export class NHNCloudEmailService {
  private readonly logger = new Logger(NHNCloudEmailService.name);

  private readonly endpoint =
    'https://email.api.nhncloudservice.com/email/v2.0';

  appKey = this.config.appKey;
  secretKey = this.config.secretKey;
  sender = this.config.sender;
  senderName = this.config.senderName;

  get baseUrl() {
    return `${this.endpoint}/appKeys/${this.appKey}`;
  }
  get headers() {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Secret-Key': this.secretKey,
    };
  }

  constructor(
    @Inject(NHN_CLOUD_EMAIL_MODULE_CONFIG)
    private readonly config: NHNCloudEmailModuleConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 이메일을 발송합니다.
   * @param {string} title
   * @param {string} content
   * @returns
   */
  sendEmail(title: string, content: string, receiver: string) {
    const body = content;

    const data = {
      receiverList: [{ receiveMailAddr: receiver, receiveType: 'MRT0' }],
      title,
      body,
    };

    return new Promise<void>((resolve, reject) => {
      this.httpService
        .post(
          `${this.baseUrl}/sender/mail`,
          {
            senderAddress: this.sender,
            senderName: this.senderName ?? undefined,
            ...data,
          },
          {
            headers: this.headers,
          },
        )
        .subscribe({
          next: (res) => {
            if (res.data.header.isSuccessful) {
              this.logger.debug(`✅ 이메일 발송에 성공했습니다.`);
              resolve();
            } else {
              this.logger.error(
                `⛔️ 이메일 발송에 실패했습니다.`,
                res.data.header.resultMessage,
              );
              reject(res.data.header.resultMessage);
            }
          },
        });
    });
  }
}

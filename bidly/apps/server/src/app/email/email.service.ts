import { Inject, Injectable, Optional } from "@nestjs/common";
import { NCPEmailService } from "../ncp/email/ncp-email.service";
import { NHNCloudEmailService } from "../nhn-cloud/email/nhn-cloud-email.service";
import { EmailRequestDTO } from "./dtos/email.dto";
import { EMAIL_MODULE_CONFIG } from "./email.module.const";
import { EmailModuleConfig } from "./email.module.type";

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_MODULE_CONFIG) private readonly config: EmailModuleConfig,
    @Optional() private readonly nhnCloudEmailService: NHNCloudEmailService,
    @Optional() private readonly ncpEmailService: NCPEmailService,
  ) {}

  /**
   * 이메일을 발송합니다.
   * @param {EmailRequestDTO} data
   * @return
   */
  async send(data: EmailRequestDTO) {
    switch (this.config.provider) {
      case "nhn-cloud":
        await this.nhnCloudEmailService.sendEmail(
          data.title,
          data.body,
          data.receiver,
        );
        break;

      case "naver-cloud-platform":
        await this.ncpEmailService.send({
          title: data.title,
          body: data.body,
          recipients: [
            {
              address: data.receiver,
              type: "R",
            },
          ],
        });
        break;
    }
  }
}

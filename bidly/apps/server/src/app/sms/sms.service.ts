import { Inject, Injectable, Optional } from "@nestjs/common";
import { NCPSmsService } from "../ncp/sms/ncp-sms.service";
import { NHNCloudSmsService } from "../nhn-cloud/sms/nhn-cloud-sms.service";
import { BatchSMSDTO, SMSDTO } from "./dtos/sms.dto";
import { SMS_MODULE_OPTIONS } from "./sms.module.const";
import { SMSModuleConfig } from "./sms.module.type";

@Injectable()
export class SmsService {
  private readonly provider = this.options.provider;

  constructor(
    @Inject(SMS_MODULE_OPTIONS) private readonly options: SMSModuleConfig,
    @Optional() private readonly nhnCloudSMSService: NHNCloudSmsService,
    @Optional() private readonly ncpSMSService: NCPSmsService,
  ) {}

  /**
   * 단일 SMS를 발송합니다. 예약 시간이 설정되어 있다면, 해당 시간에 발송됩니다.
   * @param {SMSDTO} data
   */
  async send(data: SMSDTO) {
    switch (this.provider) {
      case "naver-cloud-platform":
        return this.ncpSMSService.send({
          type: "SMS",
          content: data.body,
          messages: [
            {
              to: data.receiver,
            },
          ],
          reserveTime: data.requestDate ?? undefined,
        });

      case "nhn-cloud":
        return this.nhnCloudSMSService.send({
          body: data.body,
          recipientList: [
            {
              recipientNo: data.receiver,
            },
          ],
          requestDate: data.requestDate ?? undefined,
        });
    }
  }

  /**
   * 대량 SMS를 발송합니다. 예약 시간이 설정되어 있다면, 해당 시간에 발송됩니다.
   * @param {BatchSMSDTO} data
   */
  sendBatch(data: BatchSMSDTO) {
    switch (this.provider) {
      case "naver-cloud-platform":
        return this.ncpSMSService.send({
          type: "SMS",
          content: data.body,
          messages: data.receivers.map((receiver) => ({
            to: receiver,
          })),
          reserveTime: data.requestDate ?? undefined,
        });

      case "nhn-cloud":
        return this.nhnCloudSMSService.send({
          body: data.body,
          recipientList: data.receivers.map((receiver) => ({
            recipientNo: receiver,
          })),
          requestDate: data.requestDate ?? undefined,
        });
    }
  }
}

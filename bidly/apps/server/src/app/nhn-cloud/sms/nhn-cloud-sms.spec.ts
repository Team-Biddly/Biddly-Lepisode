import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { NHN_CLOUD_SMS_MODULE_CONFIG } from "./nhn-cloud-sms.module.const";
import { NHNCloudSmsService } from "./nhn-cloud-sms.service";
import { NHNCloudSMSRequest } from "./nhn-cloud-sms.type";

describe("NHNCloudSmsService", () => {
  let service: NHNCloudSmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: NHN_CLOUD_SMS_MODULE_CONFIG,
          useValue: {
            appKey: "p5HeMrmYuc9dLWeO",
            secretKey: "xCekXVnt",
            sendNo: "01079195300",
          },
        },
        NHNCloudSmsService,
      ],
    }).compile();

    service = module.get<NHNCloudSmsService>(NHNCloudSmsService);
  });

  it("should send nhn sms", async () => {
    const request: NHNCloudSMSRequest = {
      body: "NHN 클라우드 메시지 전송",
      recipientList: [
        {
          recipientNo: "01036987705",
        },
      ],
    };

    await service.send(request);
  });
});

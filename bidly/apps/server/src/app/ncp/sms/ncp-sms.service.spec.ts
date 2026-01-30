import { Test, TestingModule } from "@nestjs/testing";
import { NCPSmsService } from "./ncp-sms.service";
import { NCP_SMS_MODULE_OPTIONS } from "./ncp-sms.const";
import { HttpModule } from "@nestjs/axios";
describe("NCPSmsService", () => {
  let service: NCPSmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [
        {
          provide: NCP_SMS_MODULE_OPTIONS,
          useValue: {
            accessKey: "ncp_iam_BPASKR4YakwXngyoCxXK",
            secretKey: "ncp_iam_BPKSKRN38ZpPS24hhLKwzQfziPamSZ3Lcw",
            serviceId: "ncp:sms:kr:338220966175:samcheonpo-today",
            sendNo: "01035533459",
          },
        },
        NCPSmsService,
      ],
    }).compile();

    service = module.get<NCPSmsService>(NCPSmsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendSms", () => {
    it("should send sms", async () => {
      const response = await service.send({
        content: "test",
        type: "sms",
        messages: [{ to: "01079195300" }],
      });
    });
  });
});

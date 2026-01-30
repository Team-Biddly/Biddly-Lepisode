import { Test, TestingModule } from "@nestjs/testing";
import { NCPEmailService } from "./ncp-email.service";
import { HttpModule } from "@nestjs/axios";
import { NCP_CLOUD_EMAIL_MODULE_CONFIG } from "./ncp-email.module.const";

describe("NCPEmailService", () => {
  let service: NCPEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [
        {
          provide: NCP_CLOUD_EMAIL_MODULE_CONFIG,
          useValue: {
            accessKey: "zpuF4fY8G4P8PVuvZDYI",
            secretKey: "VNYuuilqRsZvX70elhjVf4u5V9desFLsM6CuTbMk",
          },
        },
        NCPEmailService,
      ],
    }).compile();

    service = module.get<NCPEmailService>(NCPEmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createMailRequest", () => {
    it("should be defined", () => {
      expect(service.send).toBeDefined();
    });

    it("should send email", async () => {
      const response = await service.send({
        title: "테스트",
        body: "<p>테스트 이메일 입니다.</p>",
        recipients: [
          {
            address: "ganghun@lepisode.team",
            type: "R",
          },
        ],
      });

      expect(response).toBeDefined();
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { NCPObjectStorageService } from "./ncp-object-storage.service";
import { NCP_OBJECT_STORAGE_MODULE_CONFIG } from "./ncp-object-storage.const";

describe("NcpCloudObjectStorageService", () => {
  let service: NCPObjectStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NCP_OBJECT_STORAGE_MODULE_CONFIG,
          useValue: {
            accessKey: "zpuF4fY8G4P8PVuvZDYI",
            secretKey: "VNYuuilqRsZvX70elhjVf4u5V9desFLsM6CuTbMk",
          },
        },
        NCPObjectStorageService,
      ],
    }).compile();

    service = module.get<NCPObjectStorageService>(NCPObjectStorageService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createBucket", () => {
    it("should be defined", () => {
      expect(service["createBucket"]).toBeDefined();
    });

    it("should create bucket", async () => {
      const response = await service["createBucket"]("eyecontact-test-bucket");

      expect(response).toBeDefined();
    });
  });

  describe("deleteFile", () => {
    it("should delete file with given url", () => {
      expect(
        service.deleteFile(
          "https://kr.object.ncloudstorage.com/model-files/240718_A_DW_3EA_0.stl",
        ),
      ).resolves.not.toThrow();
    });
  });
});

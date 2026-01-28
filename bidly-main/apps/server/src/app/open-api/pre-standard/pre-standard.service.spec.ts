import { Test, TestingModule } from '@nestjs/testing';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';
import { OpenAPIPreStandardService } from './pre-standard.service';
import { HttpModule } from '@nestjs/axios';
describe('PreStandardService', () => {
  let service: OpenAPIPreStandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: {
            serviceKey:
              'ab273c995de7f323ec241fe0354f2a6ce6e13d7470621a1b9a430fb01a994456',
          },
        },
        OpenAPIPreStandardService,
      ],
    }).compile();

    service = module.get<OpenAPIPreStandardService>(OpenAPIPreStandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPreStdThingList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdThingList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    }, 300000);
  });

  describe('getPreStdForeignList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdForeignList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdServiceList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdServiceList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdConstructionList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdConstructionList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdThingOpinionList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdThingOpinionList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdForeignOpinionList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdForeignOpinionList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdServiceOpinionList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdServiceOpinionList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getPreStdConstructionOpinionList', () => {
    it('should return result', async () => {
      const result = await service.getPreStdConstructionOpinionList({
        pageNo: 1,
        numOfRows: 999,
        inqryDiv: 1,
        inqryBgnDt: '201604010000',
        inqryEndDt: '201605052359',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });
});

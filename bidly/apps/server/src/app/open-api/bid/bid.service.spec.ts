import { Test } from '@nestjs/testing';
import { OpenAPIBidService } from './bid.service';
import { HttpModule } from '@nestjs/axios';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';
describe('BidService', () => {
  let service: OpenAPIBidService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        OpenAPIBidService,
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: {
            serviceKey:
              'ab273c995de7f323ec241fe0354f2a6ce6e13d7470621a1b9a430fb01a994456',
          },
        },
      ],
    }).compile();

    service = module.get<OpenAPIBidService>(OpenAPIBidService);
  });

  describe('getBidConstructionList', () => {
    it('should return result', async () => {
      const res = await service.getBidConstructionList({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        inqryBgnDt: '202301010000',
        inqryEndDt: '202302010000',
      });

      expect(res).toBeDefined();
      expect(res.response.header.resultCode).toBe('00');
    }, 100000);
  });

  describe('getBidThingList', () => {
    it('should return result', async () => {
      const res = await service.getBidThingList({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        inqryBgnDt: '202301010000',
        inqryEndDt: '202302010000',
      });

      expect(res).toBeDefined();
      expect(res.response.header.resultCode).toBe('00');
    }, 100000);
  });

  describe('getBidServiceList', () => {
    it('should return result', async () => {
      const res = await service.getBidServiceList({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        inqryBgnDt: '202301010000',
        inqryEndDt: '202302010000',
      });

      expect(res).toBeDefined();
      expect(res.response.header.resultCode).toBe('00');
    }, 100000);
  });

  describe('getBidForeignList', () => {
    it('should return result', async () => {
      const res = await service.getBidForeignList({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        inqryBgnDt: '202508010000',
        inqryEndDt: '202508310000',
      });

      console.log(res.response.body.items);

      expect(res).toBeDefined();
      expect(res.response.header.resultCode).toBe('00');
    }, 100000);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OpenAPIOrderPlanService } from './order-plan.service';
import { HttpModule } from '@nestjs/axios';
import { OPENAPI_MODULE_OPTIONS } from '../open-api.module.const';

describe('OrderPlanService', () => {
  let service: OpenAPIOrderPlanService;

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
        OpenAPIOrderPlanService,
      ],
    }).compile();

    service = module.get<OpenAPIOrderPlanService>(OpenAPIOrderPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderPlanListThing', () => {
    it('should return result', async () => {
      const result = await service.getOrderPlanListThing({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        orderBgnYm: '202301',
        orderEndYm: '202312',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getOrderPlanListConstruction', () => {
    it('should return result', async () => {
      const result = await service.getOrderPlanListConstruction({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        orderBgnYm: '202301',
        orderEndYm: '202312',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getOrderPlanListService', () => {
    it('should return result', async () => {
      const result = await service.getOrderPlanListService({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        orderBgnYm: '202301',
        orderEndYm: '202312',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });

  describe('getOrderPlanListForeign', () => {
    it('should return result', async () => {
      const result = await service.getOrderPlanListForeign({
        pageNo: 1,
        numOfRows: 10,
        inqryDiv: 1,
        orderBgnYm: '202301',
        orderEndYm: '202312',
      });
      expect(result).toBeDefined();
      expect(result.response.header.resultCode).toBe('00');
    });
  });
});

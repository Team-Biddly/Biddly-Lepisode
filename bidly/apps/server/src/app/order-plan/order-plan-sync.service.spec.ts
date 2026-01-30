import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { OPENAPI_MODULE_OPTIONS } from '../open-api/open-api.module.const';
import { OpenAPIOrderPlanService } from '../open-api/order-plan/order-plan.service';
import { OrderPlanSyncService } from './order-plan-sync.service';
describe('SyncOrderPlanService', () => {
  let service: OrderPlanSyncService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        OrderPlanSyncService,
        OpenAPIOrderPlanService,
        {
          provide: PrismaService,
          useValue: {
            orderPlan: {
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: {
            serviceKey:
              'SJeNb2SwQyPhlAPyXgxvIwJ6sf14r9ETtsFF3qRutlLE7BXdAEIYVGoBIj3oDA+ZDMALiSLXUbfvuMEgSefkaw==',
          },
        },
      ],
    }).compile();

    service = module.get<OrderPlanSyncService>(OrderPlanSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncConstructionOrderPlans', () => {
    it('should sync construction order plans', async () => {
      const upsertSpy = jest.spyOn(service['prisma'].orderPlan, 'upsert');

      const result = await service.syncConstructionOrderPlans();
      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.apiCalls).toBeGreaterThan(0);
      expect(upsertSpy).toHaveBeenCalled();
    }, 100000);
  });
});

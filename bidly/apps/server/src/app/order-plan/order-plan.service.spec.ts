import { Test, TestingModule } from '@nestjs/testing';
import { OrderPlanService } from './order-plan.service';

describe('OrderPlanService', () => {
  let service: OrderPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderPlanService],
    }).compile();

    service = module.get<OrderPlanService>(OrderPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

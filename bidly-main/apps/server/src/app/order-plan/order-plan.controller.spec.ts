import { Test, TestingModule } from '@nestjs/testing';
import { OrderPlanController } from './order-plan.controller';
import { OrderPlanService } from './order-plan.service';

describe('OrderPlanController', () => {
  let controller: OrderPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderPlanController],
      providers: [OrderPlanService],
    }).compile();

    controller = module.get<OrderPlanController>(OrderPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

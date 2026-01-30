import { Module } from '@nestjs/common';
import { OrderPlanService } from './order-plan.service';
import { OrderPlanController } from './order-plan.controller';
import { OrderPlanSyncService } from './order-plan-sync.service';

@Module({
  controllers: [OrderPlanController],
  providers: [OrderPlanService, OrderPlanSyncService],
})
export class OrderPlanModule {}

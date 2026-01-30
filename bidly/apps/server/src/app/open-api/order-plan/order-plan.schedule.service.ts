import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OpenAPIOrderPlanService } from './order-plan.service';

@Injectable()
export class OrderPlanScheduleService {
  private readonly logger = new Logger(OrderPlanScheduleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderPlanService: OpenAPIOrderPlanService,
  ) {}

  /**
   * 발주계획들을 동기화합니다.
   */
  async syncOrderPlans() {
    const start = performance.now();

    this.logger.log(`🚀 발주계획 동기화를 시작합니다.`);

    try {
    } catch (error) {
      this.logger.error(`발주계획 동기화 중 오류 발생: ${error.message}`);
      throw error;
    }

    const duration = performance.now() - start;
    this.logger.log(
      `✅ 발주계획 동기화가 완료되었습니다. 소요 시간: ${duration.toFixed(2)}ms`,
    );
  }
}

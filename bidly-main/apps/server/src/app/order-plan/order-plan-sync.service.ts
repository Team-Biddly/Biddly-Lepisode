import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { extractSimpleKeywords, sleep } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { OrderPlanEntity } from '../open-api/order-plan/order-plan.entity';
import { OpenAPIOrderPlanService } from '../open-api/order-plan/order-plan.service';
import { OrderPlan_Construction } from '../open-api/order-plan/types/order-plan-construction.type';
import { OrderPlan_Foreign } from '../open-api/order-plan/types/order-plan-foreign.type';
import { OrderPlanListRequestParams } from '../open-api/order-plan/types/order-plan-list.request.type';
import { OrderPlan_Service } from '../open-api/order-plan/types/order-plan-service.type';
import { OrderPlan_Thing } from '../open-api/order-plan/types/order-plan-thing.type';

/**
 * 발주계획 동기화 서비스
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class OrderPlanSyncService implements OnModuleInit {
  private readonly logger = new Logger(OrderPlanSyncService.name);

  private readonly batchSize = 100;

  constructor(
    private readonly orderPlanService: OpenAPIOrderPlanService,
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) { }

  async onModuleInit() {
    // this.syncOrderPlans();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncOrderPlans(startDate?: string, endDate?: string) {
    this.logger.debug('🚀 발주계획 동기화를 시작합니다.');

    const start = performance.now();

    const thingResult = await this.syncThingOrderPlans(startDate, endDate);
    const serviceResult = await this.syncServiceOrderPlans(startDate, endDate);
    const constructionResult = await this.syncConstructionOrderPlans(
      startDate,
      endDate,
    );

    const foreignResult = await this.syncForeignOrderPlans(startDate, endDate);

    const totalCount = [
      constructionResult,
      thingResult,
      serviceResult,
      foreignResult,
    ].reduce((acc, cur) => (acc || 0) + (cur?.totalCount || 0), 0);

    this.logger.debug(
      `✅ 총 ${totalCount}건의 발주계획 동기화를 완료했습니다.`,
    );

    await this.prisma.syncLog.create({
      data: {
        apiCalls:
          constructionResult.apiCalls ||
          0 + thingResult.apiCalls ||
          0 + serviceResult.apiCalls ||
          0 + foreignResult.apiCalls ||
          0,
        duration: performance.now() - start,
        entries: totalCount,
        type: '발주계획',
      },
    });
  }

  /**
   * 물품 발주계획을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 발주계획을 조회 및 데이터베이스에 저장합니다.
   *
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncThingOrderPlans(startDate?: string, endDate?: string) {
    this.logger.debug('🚀 물품 발주계획 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;
    let processedCount = 0;
    let isFirstCall = true;

    while (true) {
      pageNo++;
      const params: OrderPlanListRequestParams = {
        pageNo,
        numOfRows: this.batchSize,
        inqryDiv: 1,
        orderBgnYm: dayjs(startDate ?? new Date()).format('YYYYMM'),
        orderEndYm: dayjs(endDate ?? new Date()).format('YYYYMM'),
        inqryBgnDt: startDate
          ? dayjs(startDate)?.format('YYYYMMDD0000')
          : dayjs().startOf('month').format('YYYYMMDDHHmm'),
        inqryEndDt: endDate
          ? dayjs(endDate)?.format('YYYYMMDD2359')
          : dayjs().add(1, 'month').format('YYYYMMDDHHmm'),
      };

      const response =
        await this.orderPlanService.getOrderPlanListThing(params);
      apiCalls++;
      totalCount = response.response.body.totalCount;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 물품발주계획이 없습니다.');
        return;
      }

      if (isFirstCall) {
        this.logger.log(`💽 총 ${totalCount}개의 물품발주계획을 동기화합니다.`);
        isFirstCall = false;
      }

      for (const item of response.response.body.items) {
        await this.saveOrderPlan(item);
        processedCount++;
      }

      this.logger.log(
        `✅ ${processedCount}/${totalCount} 물품발주계획을 동기화했습니다.`,
      );
      if (pageNo * Number(params.numOfRows || this.batchSize) >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 물품 발주계획 동기화를 완료했습니다. 소요 시간: ' +
      (performance.now() - start) +
      'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 공사 발주계획을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 발주계획을 조회 및 데이터베이스에 저장합니다.
   *
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncConstructionOrderPlans(startDate?: string, endDate?: string) {
    this.logger.debug('🚀 공사 발주계획 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;
    let processedCount = 0;
    let isFirstCall = true;

    while (true) {
      pageNo++;
      const params: OrderPlanListRequestParams = {
        pageNo,
        numOfRows: this.batchSize,
        inqryDiv: 1,
        orderBgnYm: dayjs(startDate ?? new Date()).format('YYYYMM'),
        orderEndYm: dayjs(endDate ?? new Date()).format('YYYYMM'),
        inqryBgnDt: startDate
          ? dayjs(startDate)?.format('YYYYMMDD0000')
          : dayjs().startOf('month').format('YYYYMMDDHHmm'),
        inqryEndDt: endDate
          ? dayjs(endDate)?.format('YYYYMMDD2359')
          : dayjs().add(1, 'month').format('YYYYMMDDHHmm'),
      };

      const response =
        await this.orderPlanService.getOrderPlanListConstruction(params);
      apiCalls++;
      totalCount = response.response.body.totalCount;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 공사발주계획이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      if (isFirstCall) {
        this.logger.log(`💽 총 ${totalCount}개의 공사발주계획을 동기화합니다.`);
        isFirstCall = false;
      }

      for (const item of response.response.body.items) {
        await this.saveOrderPlan(item);
        processedCount++;
      }

      this.logger.log(
        `✅ ${processedCount}/${totalCount} 공사발주계획을 동기화했습니다.`,
      );
      if (pageNo * Number(params.numOfRows || this.batchSize) >= totalCount) {
        break;
      }
    }

    this.logger.debug(
      '✅ 공사 발주계획 동기화를 완료했습니다. 소요 시간: ' +
      (performance.now() - start) +
      'ms',
    );

    await sleep();

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 용역 발주계획을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 발주계획을 조회 및 데이터베이스에 저장합니다.
   *
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncServiceOrderPlans(startDate?: string, endDate?: string) {
    this.logger.debug('🚀 용역 발주계획 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;
    let processedCount = 0;
    let isFirstCall = true;

    while (true) {
      pageNo++;
      const params: OrderPlanListRequestParams = {
        pageNo,
        numOfRows: this.batchSize,
        inqryDiv: 1,
        orderBgnYm: dayjs(startDate ?? new Date()).format('YYYYMM'),
        orderEndYm: dayjs(endDate ?? new Date()).format('YYYYMM'),
        inqryBgnDt: startDate
          ? dayjs(startDate)?.format('YYYYMMDD0000')
          : dayjs().startOf('month').format('YYYYMMDDHHmm'),
        inqryEndDt: endDate
          ? dayjs(endDate)?.format('YYYYMMDD2359')
          : dayjs().add(1, 'month').format('YYYYMMDDHHmm'),
      };

      const response =
        await this.orderPlanService.getOrderPlanListService(params);
      apiCalls++;
      totalCount = response.response.body.totalCount;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 용역발주계획이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      if (isFirstCall) {
        this.logger.log(`💽 총 ${totalCount}개의 용역발주계획을 동기화합니다.`);
        isFirstCall = false;
      }

      for (const item of response.response.body.items) {
        await this.saveOrderPlan(item);
        processedCount++;
      }

      this.logger.log(
        `✅ ${processedCount}/${totalCount} 용역발주계획을 동기화했습니다.`,
      );
      if (pageNo * Number(params.numOfRows || this.batchSize) >= totalCount) {
        break;
      }
    }

    this.logger.debug(
      '✅ 용역 발주계획 동기화를 완료했습니다. 소요 시간: ' +
      (performance.now() - start) +
      'ms',
    );

    await sleep();

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 외자 발주계획을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 발주계획을 조회 및 데이터베이스에 저장합니다.
   *
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncForeignOrderPlans(startDate?: string, endDate?: string) {
    this.logger.debug('🚀 외자 발주계획 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;
    let processedCount = 0;
    let isFirstCall = true;

    while (true) {
      pageNo++;
      const params: OrderPlanListRequestParams = {
        pageNo,
        numOfRows: this.batchSize,
        inqryDiv: 1,
        orderBgnYm: dayjs(startDate ?? new Date()).format('YYYYMM'),
        orderEndYm: dayjs(endDate ?? new Date()).format('YYYYMM'),
        inqryBgnDt: startDate
          ? dayjs(startDate)?.format('YYYYMMDD0000')
          : dayjs().startOf('month').format('YYYYMMDDHHmm'),
        inqryEndDt: endDate
          ? dayjs(endDate)?.format('YYYYMMDD2359')
          : dayjs().add(1, 'month').format('YYYYMMDDHHmm'),
      };

      const response =
        await this.orderPlanService.getOrderPlanListForeign(params);
      apiCalls++;
      totalCount = response.response.body.totalCount;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 외자발주계획이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      if (isFirstCall) {
        this.logger.log(`💽 총 ${totalCount}개의 외자발주계획을 동기화합니다.`);
        isFirstCall = false;
      }

      for (const item of response.response.body.items) {
        await this.saveOrderPlan(item);
        processedCount++;
      }

      this.logger.log(
        `✅ ${processedCount}/${totalCount} 외자발주계획을 동기화했습니다.`,
      );
      if (pageNo * Number(params.numOfRows || this.batchSize) >= totalCount) {
        break;
      }
    }

    this.logger.debug(
      '✅ 외자 발주계획 동기화를 완료했습니다. 소요 시간: ' +
      (performance.now() - start) +
      'ms',
    );

    await sleep();

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 발주계획을 데이터베이스에 저장합니다.
   * @param orderPlan
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private async saveOrderPlan(
    orderPlan:
      | OrderPlan_Thing
      | OrderPlan_Service
      | OrderPlan_Construction
      | OrderPlan_Foreign,
  ) {
    const orderPlanEntity = new OrderPlanEntity(orderPlan);
    const data = orderPlanEntity.toCreateInput();

    if (data.사업명?.includes('정수기')) {
      console.log('정수기 발주계획 발견:', data);
    }

    if (!data.id || data.id.trim() === '') {
      return;
    }

    // 중복 체크를 위한 기존 데이터 조회
    const existingOrderPlan = await this.prisma.orderPlan.findUnique({
      where: { id: data.id },
    });

    try {
      // 키워드 추출
      const keywords = await this.getKeywords(orderPlan);

      if (!existingOrderPlan) {
        // 새로운 데이터 생성
        await this.prisma.orderPlan.create({
          data: {
            ...data,
            keywords,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        // 유니크 제약 조건 위반 (동시성 이슈)
        this.logger.warn(
          `발주계획 ID ${data.id}가 이미 존재합니다. 기존 데이터를 반환합니다.`,
        );
        return await this.prisma.orderPlan.findUnique({
          where: { id: data.id },
        });
      }

      this.logger.error(
        `발주계획 저장 중 오류 발생 (ID: ${data.id}):`,
        error.message,
      );
      throw error;
    }
  }

  private async getKeywords(
    orderPlan:
      | OrderPlan_Thing
      | OrderPlan_Service
      | OrderPlan_Construction
      | OrderPlan_Foreign,
  ): Promise<string[]> {
    const isProduction = process.env.NODE_ENV === 'production';

    try {
      if (isProduction) {
        // 프로덕션 환경에서만 OpenAI API 호출
        const keywords = await this.ai.extractKeywords(orderPlan.bizNm);
        return keywords;
      } else {
        // 개발/테스트 환경에서는 간단한 키워드 추출
        const bizNm = orderPlan.bizNm || '';
        const simpleKeywords = extractSimpleKeywords(bizNm);
        return simpleKeywords;
      }
    } catch (error) {
      // 오류 발생 시 폴백으로 간단한 키워드 추출 사용
      this.logger.log('OpenAI API 실패 시 폴백: 간단한 키워드 추출로 전환');
      const bizNm = orderPlan.bizNm || '';
      return extractSimpleKeywords(bizNm) || [];
    }
  }
}

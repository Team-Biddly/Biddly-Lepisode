import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { extractSimpleKeywords, sleep } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { DocumentParseService } from '../document/document-parse.service';
import { PreStandardOpinionEntity } from '../open-api/pre-standard/pre-standard-opinion.entity';
import { PreStandardEntity } from '../open-api/pre-standard/pre-standard.entity';
import { OpenAPIPreStandardService } from '../open-api/pre-standard/pre-standard.service';
import { PreStandard_Construction } from '../open-api/pre-standard/types/pre-standard-construction.type';
import { OpenAPIPreStandardForeign } from '../open-api/pre-standard/types/pre-standard-foreign.type';
import { PreStandardListRequestParams } from '../open-api/pre-standard/types/pre-standard-list.request.type';
import { PreStandard_Service } from '../open-api/pre-standard/types/pre-standard-service.type';
import { PreStandard_Thing } from '../open-api/pre-standard/types/pre-standard-thing.type';
import { SyncResult } from '../open-api/sync/sync-result.type';

/**
 * 사전규격 동기화 서비스
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class PreStandardSyncService implements OnModuleInit {
  private readonly logger = new Logger(PreStandardSyncService.name);

  constructor(
    private readonly openapi: OpenAPIPreStandardService,
    private readonly prisma: PrismaService,
    private readonly parser: DocumentParseService,
    private readonly aiService: AiService,
  ) {}

  onModuleInit() {
    // this.syncPrestandards();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncPrestandards() {
    const start = performance.now();
    this.logger.debug('🚀 사전규격 동기화를 시작합니다.');

    const constructionResult = await this.syncConstructionPreStandards();
    const thingResult = await this.syncThingPreStandards();
    const serviceResult = await this.syncServicePreStandards();
    const foreignResult = await this.syncForeignPreStandards();

    const totalCount = [
      constructionResult,
      thingResult,
      serviceResult,
      foreignResult,
    ].reduce((acc, cur) => acc + cur?.totalCount || 0, 0);

    this.logger.debug(
      `✅ 총 ${totalCount}건의 사전규격 동기화를 완료했습니다.`,
    );

    const duration = performance.now() - start;

    await this.prisma.syncLog.create({
      data: {
        apiCalls:
          constructionResult.apiCalls +
          thingResult.apiCalls +
          serviceResult.apiCalls +
          foreignResult.apiCalls,
        duration,
        entries: totalCount,
        type: '사전규격',
      },
    });

    this.logger.debug(
      `✅ 사전규격 동기화 로그를 저장했습니다. 소요 시간: ${duration}ms`,
    );
  }

  /**
   * 물품 사전규격을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 사전규격을 조회 및 데이터베이스에 저장합니다.
   *
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncThingPreStandards(indexDate?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 물품 사전규격 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: PreStandardListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(indexDate).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(indexDate).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.openapi.getPreStdThingList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 사전규격가 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      this.logger.log(`💽 총 ${totalCount}개의 사전규격를 동기화합니다.`);

      for (const item of response.response.body.items) {
        await this.savePreStandard(item);
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 사전규격를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }
    }

    this.logger.debug(
      '✅ 물품 사전규격 동기화를 완료했습니다. 소요 시간: ' +
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
   * 공사 사전규격을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 사전규격을 조회 및 데이터베이스에 저장합니다.
   *
   * @return {SyncResult} 동기화 결과
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async syncConstructionPreStandards(indexDate?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 공사 사전규격 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: PreStandardListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(indexDate).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(indexDate).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.openapi.getPreStdConstructionList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 사전규격이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      for (const item of response.response.body.items) {
        await this.savePreStandard(item);
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 사전규격를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 공사 사전규격 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 용역 사전규격을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 사전규격을 조회 및 데이터베이스에 저장합니다.
   *
   * @return {SyncResult} 동기화 결과
   * @author 최강훈 <
   */
  async syncServicePreStandards(indexDate?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 용역 사전규격 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: PreStandardListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(indexDate).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(indexDate).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.openapi.getPreStdServiceList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 사전규격이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      for (const item of response.response.body.items) {
        await this.savePreStandard(item);
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 사전규격를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 용역 사전규격 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 외자 사전규격을 동기화합니다.
   *
   * 실행 시점 일자에 등록된 사전규격을 조회 및 데이터베이스에 저장합니다.
   *
   * @return {SyncResult} 동기화 결과
   * @author 최강훈 <
   */
  async syncForeignPreStandards(indexDate?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 외자 사전규격 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: PreStandardListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(indexDate).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(indexDate).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.openapi.getPreStdForeignList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 사전규격이 없습니다.');
        return {
          totalCount,
          apiCalls,
        };
      }

      for (const item of response.response.body.items) {
        await this.savePreStandard(item);
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 사전규격를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 외자 사전규격 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 사전규격을 데이터베이스에 저장합니다.
   * @param preStandard
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private async savePreStandard(
    preStandard:
      | PreStandard_Thing
      | PreStandard_Construction
      | PreStandard_Service
      | OpenAPIPreStandardForeign,
  ) {
    const entity = new PreStandardEntity(preStandard);

    const check = await this.prisma.preStandard.findUnique({
      where: { id: preStandard.bfSpecRgstNo },
      select: { id: true },
    });

    if (check) return;

    const createData = entity.toCreateInput();

    try {
      switch (createData.업무구분명) {
        case '물품': {
          const response = await this.openapi.getPreStdThingOpinionList({
            inqryDiv: 2,
            bfSpecRgstNo: preStandard.bfSpecRgstNo,
            pageNo: 1,
            numOfRows: 100,
          });
          createData.의견목록 = response.response.body.items.map((i) =>
            new PreStandardOpinionEntity(i).toJSON(),
          );
          break;
        }
        case '공사': {
          const response = await this.openapi.getPreStdConstructionOpinionList({
            inqryDiv: 2,
            bfSpecRgstNo: preStandard.bfSpecRgstNo,
            pageNo: 1,
            numOfRows: 100,
          });
          createData.의견목록 = response.response.body.items.map((i) =>
            new PreStandardOpinionEntity(i).toJSON(),
          );
          break;
        }

        case '용역': {
          const response = await this.openapi.getPreStdServiceOpinionList({
            inqryDiv: 2,
            bfSpecRgstNo: preStandard.bfSpecRgstNo,
            pageNo: 1,
            numOfRows: 100,
          });
          createData.의견목록 = response.response.body.items.map((i) =>
            new PreStandardOpinionEntity(i).toJSON(),
          );
          break;
        }

        case '외자': {
          const response = await this.openapi.getPreStdForeignOpinionList({
            inqryDiv: 2,
            bfSpecRgstNo: preStandard.bfSpecRgstNo,
            pageNo: 1,
            numOfRows: 100,
          });
          createData.의견목록 = response.response.body.items.map((i) =>
            new PreStandardOpinionEntity(i).toJSON(),
          );
          break;
        }
      }
    } catch {
      this.logger.warn(
        `⚠️ 사전규격 의견을 불러오는 중 오류가 발생했습니다: ${preStandard.bfSpecRgstNo}`,
      );
    }
    const keywords = await this.getKeywords(preStandard);

    await this.prisma.preStandard.create({
      data: {
        ...entity.toCreateInput(),
        keywords,
      },
    });
  }

  private async getKeywords(
    preStandard:
      | PreStandard_Thing
      | PreStandard_Construction
      | PreStandard_Service
      | OpenAPIPreStandardForeign,
  ): Promise<string[]> {
    const url = preStandard.specDocFileUrl1;
    const isProduction = process.env.NODE_ENV === 'production';

    let keywords: string[] = [];

    // check if url is valid url
    if (url && url.startsWith('http')) {
      try {
        const buffer = await fetch(url).then((res) => res.arrayBuffer());
        const content = await this.parser.parse(buffer);
        if (isProduction) {
          keywords = await this.aiService.extractKeywords(content);
        } else {
          keywords = extractSimpleKeywords(content);
        }
      } catch {
        this.logger.warn(
          `문서 파싱 또는 키워드 추출 실패, 제품명으로 대체: ${preStandard.bfSpecRgstNo}`,
        );
        try {
          if (isProduction) {
            keywords = await this.aiService.extractKeywords(
              preStandard.prdctClsfcNoNm,
            );
          } else {
            keywords = extractSimpleKeywords(preStandard.prdctClsfcNoNm);
          }
        } catch {
          this.logger.warn(
            `제품명 키워드 추출도 실패, 빈 배열 반환1 간단 키워드 추출로 전환: ${preStandard.bfSpecRgstNo}`,
          );
          keywords = extractSimpleKeywords(preStandard.prdctClsfcNoNm) || [];
        }
      }
    } else {
      try {
        if (isProduction) {
          keywords = await this.aiService.extractKeywords(
            preStandard.prdctClsfcNoNm,
          );
        } else {
          keywords = extractSimpleKeywords(preStandard.prdctClsfcNoNm);
        }
      } catch {
        this.logger.warn(
          `키워드 추출 실패, 빈 배열 반환2 간단 키워드 추출로 전환: ${preStandard.bfSpecRgstNo}`,
        );
        keywords = extractSimpleKeywords(preStandard.prdctClsfcNoNm) || [];
      }
    }

    return keywords;
  }
}

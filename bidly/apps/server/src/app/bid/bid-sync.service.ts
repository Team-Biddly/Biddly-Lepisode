import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { extractSimpleKeywords, sleep } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { DocumentParseService } from '../document/document-parse.service';
import { OpenAPIBidService } from '../open-api/bid/bid.service';
import { BidConstructionEntity } from '../open-api/bid/entities/bid-construction.entity.class';
import { BidEtcEntity } from '../open-api/bid/entities/bid-etc.entity.class';
import { BidForeignEntity } from '../open-api/bid/entities/bid-foreign.entity.class';
import { BidServiceEntity } from '../open-api/bid/entities/bid-service.entity.class';
import { BidThingEntity } from '../open-api/bid/entities/bid-thing.entity.class';
import { Bid_Construction } from '../open-api/bid/types/bid-construction.type';
import { Bid_Etc } from '../open-api/bid/types/bid-etc.type';
import { Bid_Foreign } from '../open-api/bid/types/bid-foreign.type';
import { BidListRequestParams } from '../open-api/bid/types/bid-list.request.type';
import { Bid_Service } from '../open-api/bid/types/bid-service.type';
import { Bid_Thing } from '../open-api/bid/types/bid-thing.type';
import { SyncResult } from '../open-api/sync/sync-result.type';

/**
 * 입찰공고 동기화 서비스
 * @author 최강훈 <ganghun@lepisode.team>
 */
@Injectable()
export class BidSyncService implements OnModuleInit {
  private readonly logger = new Logger(BidSyncService.name);

  private readonly batchSize = 100;

  constructor(
    private readonly bidService: OpenAPIBidService,
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly parser: DocumentParseService,
  ) {}

  onModuleInit() {
    // 한 번만 실행 후 주석 처리하세요
    this.backfillBidEtc();
  }

  /**
   * 기타 입찰공고 과거 데이터를 backfill합니다.
   * 한 번만 실행 후 onModuleInit에서 호출을 주석 처리하세요.
   *
   * @param years 몇 년 전까지 가져올지 (기본값: 2년)
   */
  async backfillBidEtc(years = 2) {
    this.logger.log(
      `🚀 기타 입찰공고 Backfill 시작 (${years}년 전까지, 최신부터)`,
    );

    const startDate = dayjs().subtract(1, 'day').startOf('day'); // 어제부터 시작
    const endDate = dayjs().subtract(years, 'year').startOf('day'); // 2년 전까지

    let currentDate = startDate;
    let totalSynced = 0;
    const totalDays = startDate.diff(endDate, 'day') + 1;
    let processedDays = 0;

    while (currentDate.isAfter(endDate) || currentDate.isSame(endDate, 'day')) {
      processedDays++;
      this.logger.log(
        `📅 [${processedDays}/${totalDays}] ${currentDate.format('YYYY-MM-DD')} 데이터 동기화 중...`,
      );

      try {
        const result = await this.syncBidEtc(currentDate.toDate());
        if (result?.totalCount) {
          totalSynced += result.totalCount;
        }
      } catch (error) {
        this.logger.error(
          `❌ ${currentDate.format('YYYY-MM-DD')} 동기화 실패:`,
          error,
        );
      }

      currentDate = currentDate.subtract(1, 'day'); // 하루씩 과거로

      // Rate limit 방지를 위한 대기
      await sleep(500);
    }

    this.logger.log(
      `✅ 기타 입찰공고 Backfill 완료! 총 ${totalSynced}건 동기화됨`,
    );
  }

  /**
   * 입찰공고를 동기화합니다.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async syncBids() {
    this.logger.debug('🚀 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    const constructionResult = await this.syncBidConstructions();
    const thingResult = await this.syncBidThings();
    const serviceResult = await this.sincBidService();
    const foreignResult = await this.syncBidForeign();
    const etcResult = await this.syncBidEtc();

    const totalCount = [
      constructionResult,
      thingResult,
      serviceResult,
      foreignResult,
      etcResult,
    ].reduce((acc, cur) => (acc || 0) + (cur?.totalCount || 0), 0);

    await this.prisma.syncLog.create({
      data: {
        apiCalls:
          constructionResult.apiCalls +
          thingResult.apiCalls +
          serviceResult.apiCalls +
          foreignResult.apiCalls +
          etcResult.apiCalls,
        duration: performance.now() - start,
        entries: totalCount,
        type: '입찰공고',
      },
    });

    this.logger.debug(
      `✅ 총 ${totalCount}건의 입찰공고 동기화를 완료했습니다.`,
    );
  }

  /**
   * 공고 수집 시 첨부파일을 인지하여 Convert 테이블에 개별 텍스트로 변환 및 저장합니다.
   */
  async processConvert(item: any, bidName: string) {
    const bidId = item.bidNtceNo || item.id;
    if (!bidId) return;

    const urls = [];
    for (let i = 1; i <= 10; i++) {
      const urlKey = `ntceSpecDocUrl${i}`;
      if (item[urlKey] && item[urlKey].trim() !== '') {
        urls.push(item[urlKey]);
      }
    }

    if (urls.length === 0) return;

    for (const url of urls) {
      try {
        const response = await fetch(
          `${process.env.PYTHON_ENGINE_URL || 'http://localhost:8000'}/extract-text`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_url: url }),
          },
        );

        if (response.ok) {
          const result = await response.json();
          const text = result.extracted_text;

          if (text && text.trim() !== '') {
            await this.prisma.convert.upsert({
              where: { url },
              create: {
                url,
                bidId, // 공고 ID 연결
                name: bidName || '첨부파일',
                convertedText: text,
                isConverted: true,
              },
              update: {
                bidId,
                convertedText: text,
                isConverted: true,
              },
            });
            this.logger.log(`✅ 파일 저장 완료: ${url}`);
          }
        }
      } catch (error) {
        this.logger.error(`❌ 파일 변환 오류 (${url}):`, error);
      }
    }
  }

  /**
   * 건축 입찰공고를 동기화합니다.
   *
   * 실행 시점 일자에 등록된 입찰공고를 조회 및 데이터베이스에 저장합니다.
   *
   * @returns {SyncResult} 동기화 결과
   * @author 최강훈 <ganghun@lepiosode.team>
   */
  async syncBidConstructions(): Promise<SyncResult> {
    this.logger.debug('🚀 건축 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: BidListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs().startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs().endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.bidService.getBidConstructionList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 입찰공고가 없습니다.');
        return;
      }

      this.logger.log(`💽 총 ${totalCount}개의 입찰공고를 동기화합니다.`);

      for (const item of response.response.body.items) {
        const data = new BidConstructionEntity(item).toCreateInput();

        // [추가] 파일 변환 및 Convert 테이블 저장
        await this.processConvert(item, data.입찰공고명);

        const existing = await this.prisma.bid_Construction.findUnique({
          where: { id: data.id },
          select: { id: true, keywords: true },
        });

        // 새 데이터일 때만 키워드 추출
        if (!existing) {
          const url = item.ntceSpecDocUrl1;
          if (url) {
            const keywords = await this.getKeywords(item);
            data.keywords = keywords;
          }
        } else {
          // 기존 키워드 유지
          data.keywords = existing.keywords;
        }

        await this.prisma.bid_Construction.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 입찰공고를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }
      await sleep();
    }

    this.logger.debug(
      '✅ 건축 입찰공고 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 건축 입찰공고를 동기화합니다.
   *
   * 실행 시점 일자에 등록된 입찰공고를 조회 및 데이터베이스에 저장합니다.
   *
   * @returns {SyncResult} 동기화 결과
   * @author 최강훈 <ganghun@lepiosode.team>
   */
  async syncBidThings(): Promise<SyncResult> {
    this.logger.debug('🚀 건축 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: BidListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs().startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs().endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.bidService.getBidThingList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 입찰공고가 없습니다.');
        return;
      }

      this.logger.log(`💽 총 ${totalCount}개의 입찰공고를 동기화합니다.`);

      for (const item of response.response.body.items) {
        const data = new BidThingEntity(item).toCreateInput();

        // [추가] 파일 변환 및 Convert 테이블 저장
        await this.processConvert(item, data.입찰공고명);

        const existing = await this.prisma.bid_Thing.findUnique({
          where: { id: data.id },
          select: { id: true, keywords: true },
        });

        // 새 데이터일 때만 키워드 추출
        if (!existing) {
          const url = item.ntceSpecDocUrl1;
          if (url) {
            const keywords = await this.getKeywords(item);
            data.keywords = keywords;
          }
        } else {
          // 기존 키워드 유지
          data.keywords = existing.keywords;
        }

        await this.prisma.bid_Thing.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 입찰공고를 동기화했습니다.`);

      if (pageNo * 100 >= totalCount) {
        break;
      }
      await sleep();
    }

    this.logger.debug(
      '✅ 건축 입찰공고 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 용역 입찰공고를 동기화합니다.
   *
   * 실행 시점 일자에 등록된 입찰공고를 조회 및 데이터베이스에 저장합니다.
   *
   * @returns {SyncResult} 동기화 결과
   * @author 최강훈 <ganghun@lepiosode.team>
   */
  async sincBidService(): Promise<SyncResult> {
    this.logger.debug('🚀 용역 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: BidListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs().startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs().endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.bidService.getBidServiceList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 입찰공고가 없습니다.');
        return;
      }

      this.logger.log(`💽 총 ${totalCount}개의 입찰공고를 동기화합니다.`);

      for (const item of response.response.body.items) {
        const data = new BidServiceEntity(item).toCreateInput();

        // [추가] 파일 변환 및 Convert 테이블 저장
        await this.processConvert(item, data.입찰공고명);

        const existing = await this.prisma.bid_Service.findUnique({
          where: { id: data.id },
          select: { id: true, keywords: true },
        });

        // 새 데이터일 때만 키워드 추출
        if (!existing) {
          const url = item.ntceSpecDocUrl1;
          if (url) {
            const keywords = await this.getKeywords(item);
            data.keywords = keywords;
          }
        } else {
          // 기존 키워드 유지
          data.keywords = existing.keywords;
        }

        await this.prisma.bid_Service.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 입찰공고를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 용역 입찰공고 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  /**
   * 외자 입찰공고를 동기화합니다.
   *
   * 실행 시점 일자에 등록된 입찰공고를 조회 및 데이터베이스에 저장합니다.
   *
   * @returns {SyncResult} 동기화 결과
   * @author 최강훈 <ganghun@lepiosode.team>
   */
  async syncBidForeign(index?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 외자 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: BidListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(index).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(index).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.bidService.getBidForeignList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 외자 입찰공고가 없습니다.');
        return;
      }

      this.logger.log(`💽 총 ${totalCount}개의 외자 입찰공고를 동기화합니다.`);

      for (const item of response.response.body.items) {
        const data = new BidForeignEntity(item).toCreateInput();

        // [추가] 파일 변환 및 Convert 테이블 저장
        await this.processConvert(item, data.입찰공고명);

        const existing = await this.prisma.bid_Foreign.findUnique({
          where: { id: data.id },
          select: { id: true, keywords: true },
        });

        // 새 데이터일 때만 키워드 추출
        if (!existing) {
          const url = item.ntceSpecDocUrl1;
          if (url) {
            const keywords = await this.getKeywords(item);
            data.keywords = keywords;
          }
        } else {
          // 기존 키워드 유지
          data.keywords = existing.keywords;
        }

        await this.prisma.bid_Foreign.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 외자 입찰공고를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 외자 입찰공고 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  async syncBidEtc(index?: Date): Promise<SyncResult> {
    this.logger.debug('🚀 기타 입찰공고 동기화를 시작합니다.');

    const start = performance.now();

    let apiCalls = 0;
    let pageNo = 0;
    let totalCount = 0;

    while (true) {
      pageNo++;
      const params: BidListRequestParams = {
        pageNo,
        numOfRows: 100,
        inqryDiv: 1,
        inqryBgnDt: dayjs(index).startOf('day').format('YYYYMMDDHHMM'),
        inqryEndDt: dayjs(index).endOf('day').format('YYYYMMDDHHMM'),
      };

      const response = await this.bidService.getBidEtcList(params);
      apiCalls++;
      totalCount = response?.response?.body?.totalCount || 0;

      if (totalCount === 0) {
        this.logger.debug('✅ 동기화할 기타 입찰공고가 없습니다.');
        return { totalCount: 0, apiCalls };
      }

      this.logger.log(`💽 총 ${totalCount}개의 기타 입찰공고를 동기화합니다.`);

      for (const item of response.response.body.items) {
        const data = new BidEtcEntity(item).toCreateInput();

        // [추가] 파일 변환 및 Convert 테이블 저장
        await this.processConvert(item, data.입찰공고명);

        const existing = await this.prisma.bid_Etc.findUnique({
          where: { id: data.id },
          select: { id: true, keywords: true },
        });

        // 새 데이터일 때만 키워드 추출
        if (!existing) {
          const url = item.ntceSpecDocUrl1;
          if (url) {
            const keywords = await this.getKeywords(item);
            data.keywords = keywords;
          }
        } else {
          // 기존 키워드 유지
          data.keywords = existing.keywords;
        }

        await this.prisma.bid_Etc.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }

      this.logger.log(`✅ 페이지 ${pageNo}의 기타 입찰공고를 동기화했습니다.`);
      if (pageNo * 100 >= totalCount) {
        break;
      }

      await sleep();
    }

    this.logger.debug(
      '✅ 기타 입찰공고 동기화를 완료했습니다. 소요 시간: ' +
        (performance.now() - start) +
        'ms',
    );

    return {
      totalCount,
      apiCalls,
    };
  }

  async getKeywords(
    data: Bid_Construction | Bid_Etc | Bid_Foreign | Bid_Service | Bid_Thing,
  ) {
    let content: string;
    if ('ntceSpecDocUrl1' in data === false) {
      content = JSON.stringify(data);
    } else {
      const url = (data as any).ntceSpecDocUrl1;

      if (!url || url === '') return [];
      const buffer = await fetch(url).then((res) => res.arrayBuffer());

      content = await this.parser.parse(buffer);
      // OPENAI_API_KEY가 없으면 AI 호출 없이 간단 추출만 사용 (로컬/임시 env 시 401 방지)
      if (!process.env.OPENAI_API_KEY?.trim()) {
        return extractSimpleKeywords(`${(data as any).bidNtceNm} ${content}`);
      }
    }

    try {
      const keywords = await this.ai.extractKeywords(
        `${(data as any).bidNtceNm} ${content}`,
      );
      return keywords;
    } catch (error) {
      this.logger.error('❌ 키워드 추출에 실패하여 간단 추출로 변경', error);
      return extractSimpleKeywords(`${(data as any).bidNtceNm} ${content}`);
    }
  }
}

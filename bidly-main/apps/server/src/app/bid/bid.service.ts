import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import xlsx from 'xlsx';
import { OffsetPaginationDTO } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { BidConstructionDTO } from './dtos/bid-construction.dto';
import { BidForeignDTO } from './dtos/bid-foreign.dto';
import { BidServiceDTO } from './dtos/bid-service.dto';
import { BidThingDTO } from './dtos/bid-thing.dto';
import { BidViewDTO } from './dtos/bid-view.dto';
import { SearchBidDTO } from './dtos/search-bid.dto';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) { }

  async findById(
    id: string,
  ): Promise<BidConstructionDTO | BidForeignDTO | BidServiceDTO | BidThingDTO> {
    const bid = await this.prisma.bid.findFirst({
      where: { id },
    });

    if (!bid) throw new NotFoundException('입찰공고를 찾을 수 없습니다.');

    const { type } = bid;

    switch (type) {
      case 'construction': {
        const constructionBid = await this.prisma.bid_Construction.findUnique({
          where: { id },
        });
        return plainToInstance(
          BidConstructionDTO,
          {
            type: '공사',
            ...constructionBid,
          },
          {
            groups: ['detail'],
          },
        );
      }
      case 'service': {
        const serviceBid = await this.prisma.bid_Service.findUnique({
          where: { id },
        });
        return plainToInstance(
          BidServiceDTO,
          {
            type: '용역',
            ...serviceBid,
          },
          {
            groups: ['detail'],
          },
        );
      }
      case 'thing': {
        const thingBid = await this.prisma.bid_Thing.findUnique({
          where: { id },
        });
        return plainToInstance(
          BidThingDTO,
          {
            type: '물품',
            ...thingBid,
          },
          {
            groups: ['detail'],
          },
        );
      }
      case 'foreign': {
        const foreignBid = await this.prisma.bid_Foreign.findUnique({
          where: { id },
        });
        return plainToInstance(
          BidForeignDTO,
          {
            type: '외자',
            ...foreignBid,
          },
          {
            groups: ['detail'],
          },
        );
      }
    }
  }

  async search(
    options: SearchBidDTO,
  ): Promise<OffsetPaginationDTO<BidViewDTO>> {
    const {
      pageNo,
      pageSize,
      담당자,
      공고기관,
      수요기관,
      모의공고여부,
      입찰개시일시시작,
      입찰개시일시종료,
      query,
      keywords,
      orKeywords,
      notKeywords,
      andKeywords,
      budgetEndPrice,
      budgetStartPrice,
      type,
      bookmarkUserId,
    } = options;

    const where: Prisma.BidWhereInput = {};

    if (type) {
      where.type = type;
    }

    if (담당자) {
      where.공고기관담당자명 = { contains: 담당자 };
    }

    if (공고기관) {
      where.공고기관명 = { contains: 공고기관 };
    }

    if (수요기관) {
      where.수요기관명 = { contains: 수요기관 };
    }

    if (query) {
      where.OR = [];
      where.OR.push(
        { 입찰공고명: { contains: query, mode: 'insensitive' } },
        { 공고기관명: { contains: query, mode: 'insensitive' } },
        { 수요기관명: { contains: query, mode: 'insensitive' } },
      );
    }

    if (모의공고여부 !== undefined) {
      where.모의공고여부 = 모의공고여부;
    }

    if (budgetStartPrice || budgetEndPrice) {
      where.배정예산금액 = {};

      if (budgetStartPrice) {
        where.배정예산금액.gte = +budgetStartPrice;
      }
      if (budgetEndPrice) {
        where.배정예산금액.lte = +budgetEndPrice;
      }
    }

    const AND = [];

    if (입찰개시일시시작) {
      AND.push({
        입찰개시일시: { gte: new Date(입찰개시일시시작) },
      });
    }

    if (입찰개시일시종료) {
      AND.push({
        입찰개시일시: { lte: new Date(입찰개시일시종료) },
      });
    }

    if (keywords) {
      where.keywords = { hasEvery: keywords };
    }

    if (andKeywords || orKeywords || notKeywords) {
      if (andKeywords) {
        AND.push(
          ...andKeywords.map((keyword) => ({
            keywords: { has: keyword },
          })),
        );
      }
      if (orKeywords) {
        AND.push({
          OR: orKeywords.map((keyword) => ({
            keywords: { has: keyword },
          })),
        });
      }
      if (notKeywords) {
        AND.push(
          ...notKeywords.map((keyword) => ({
            NOT: {
              keywords: { has: keyword },
            },
          })),
        );
      }
    }

    where.AND = AND;

    if (bookmarkUserId) {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId: bookmarkUserId, modelName: '입찰공고' },
        select: { modelId: true },
      });

      where.id = { in: bookmarks?.map((bookmark) => bookmark?.modelId) || [] };
    }

    const [items, count] = await this.prisma.$transaction([
      this.prisma.bid.findMany({
        where,
        skip: pageNo && pageSize ? (pageNo - 1) * pageSize : undefined,
        take: pageSize,
        orderBy: { 등록일시: 'desc' },
      }),
      this.prisma.bid.count({ where }),
    ]);

    return {
      items: plainToInstance(BidViewDTO, items),
      pageInfo: {
        pageItems: items.length,
        totalItems: count,
        totalPages: pageSize ? Math.ceil(count / pageSize) : 1,
        pageNo,
        pageSize,
      },
    };
  }

  getLatestLog() {
    return this.prisma.syncLog.findFirst({
      where: { type: '입찰공고' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExcelFile(ids: string[]): Promise<Buffer> {
    const bids = await this.prisma.bid
      .findMany({
        where: { id: { in: ids } },
        orderBy: { 등록일시: 'desc' },
        omit: {
          id: true,
          type: true,
          keywords: true,
          공고규격서URL: true,
          모의공고여부: true,
        },
      })
      .then((bids) =>
        plainToInstance(BidViewDTO, bids, {
          exposeUnsetFields: false,
        }),
      )
      .then((bids) =>
        bids.map((bid, i) => ({
          No: i + 1,
          ...bid,
        })),
      );

    const worksheet = xlsx.utils.json_to_sheet(bids);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Bids');

    const excelBuffer: Buffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    return excelBuffer;
  }

  async updateKeywords(id: string, keywords: string[]): Promise<void> {
    const bid = await this.prisma.bid.findFirst({ where: { id } });
    if (!bid) {
      throw new NotFoundException('입찰공고를 찾을 수 없습니다.');
    }

    switch (bid.type) {
      case 'construction':
        await this.prisma.bid_Construction.update({
          where: { id },
          data: { keywords },
        });
        break;
      case 'service':
        await this.prisma.bid_Service.update({
          where: { id },
          data: { keywords },
        });
        break;
      case 'thing':
        await this.prisma.bid_Thing.update({
          where: { id },
          data: { keywords },
        });
        break;
      case 'foreign':
        await this.prisma.bid_Foreign.update({
          where: { id },
          data: { keywords },
        });
        break;
    }
  }
}

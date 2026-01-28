import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import xlsx from 'xlsx';
import { OffsetPaginationDTO } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderPlanDTO } from './dtos/order-plan.dto';
import { SearchOrderPlanDTO } from './dtos/search-order-plan.dto';

@Injectable()
export class OrderPlanService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * 입력한 ID에 해당하는 발주계획을 조회합니다.
   * @param id
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async findById(id: string) {
    const orderPlan = await this.prisma.orderPlan.findUnique({
      where: { id },
    });

    if (!orderPlan) {
      throw new NotFoundException('발주계획을 찾을 수 없습니다.');
    }

    return orderPlan;
  }

  /**
   * 발주 계획을 검색합니다.
   * @param options
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async search(
    options: SearchOrderPlanDTO,
  ): Promise<OffsetPaginationDTO<OrderPlanDTO>> {
    const {
      pageNo,
      pageSize,
      keywords,
      andKeywords,
      notKeywords,
      orKeywords,
      startPrice,
      endPrice,
      startDate,
      endDate,
      발주기관,
      담당자,
      query,
      bookmarkUserId,
      type,
    } = options;

    const where: Prisma.OrderPlanWhereInput = {};
    const OR: Prisma.OrderPlanWhereInput[] = [];

    if (발주기관) {
      where.발주기관명 = { contains: 발주기관 };
    }

    if (담당자) {
      where.담당자명 = { contains: 담당자 };
    }

    if (query) {
      OR.push(
        { id: { contains: query, mode: 'insensitive' } },
        { 사업명: { contains: query, mode: 'insensitive' } },
        { 총괄기관명: { contains: query, mode: 'insensitive' } },
        { 발주기관명: { contains: query, mode: 'insensitive' } },
        { 공사지역명: { contains: query, mode: 'insensitive' } },
        { 공종구분명: { contains: query, mode: 'insensitive' } },
        { 계약방법명: { contains: query, mode: 'insensitive' } },
        { 담당자명: { contains: query, mode: 'insensitive' } },
      );
    }

    if (startDate && endDate) {
      where.게시일시 = {
        gte: dayjs(startDate).startOf('day').toDate(),
        lte: dayjs(endDate).endOf('day').toDate(),
      };
    }

    if (keywords) {
      where.keywords = { hasEvery: keywords };
    }

    if (startPrice || endPrice) {
      where.합계발주금액 = {};

      if (startPrice) {
        where.합계발주금액.gte = +startPrice;
      }
      if (endPrice) {
        where.합계발주금액.lte = +endPrice;
      }
    }

    if (andKeywords || orKeywords || notKeywords) {
      where.AND = [];
      if (andKeywords) {
        where.AND.push(
          ...andKeywords.map((keyword) => ({
            keywords: { has: keyword },
          })),
        );
      }
      if (orKeywords) {
        where.AND.push({
          OR: orKeywords.map((keyword) => ({
            keywords: { has: keyword },
          })),
        });
      }
      if (notKeywords) {
        where.AND.push(
          ...notKeywords.map((keyword) => ({
            NOT: {
              keywords: { has: keyword },
            },
          })),
        );
      }
    }

    if (bookmarkUserId) {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId: bookmarkUserId, modelName: '발주계획' },
        select: { modelId: true },
      });

      where.id = { in: bookmarks?.map((bookmark) => bookmark?.modelId) || [] };
    }

    if (type) {
      where.업무구분명 = {
        equals: type,
      };
    }

    if (OR.length) where.OR = OR;

    const [items, count] = await this.prisma.$transaction([
      this.prisma.orderPlan.findMany({
        where,
        skip: pageNo && pageSize ? (pageNo - 1) * pageSize : undefined,
        take: pageSize,
        orderBy: { 게시일시: 'desc' },
      }),
      this.prisma.orderPlan.count({ where }),
    ]);

    return {
      items: plainToInstance(OrderPlanDTO, items),
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
      where: { type: '발주계획' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExcelFile(ids: string[]): Promise<Buffer> {
    const orderPlans = await this.prisma.orderPlan
      .findMany({
        where: { id: { in: ids } },
        orderBy: { 게시일시: 'desc' },
        omit: {
          id: true,
          keywords: true,
        },
      })
      .then((orderPlans) =>
        plainToInstance(OrderPlanDTO, orderPlans, {
          exposeUnsetFields: false,
        }),
      )
      .then((orderPlans) =>
        orderPlans.map((orderPlan, i) => ({
          No: i + 1,
          ...orderPlan,
        })),
      );

    const worksheet = xlsx.utils.json_to_sheet(orderPlans);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'OrderPlans');

    const excelBuffer: Buffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    return excelBuffer;
  }

  async updateKeywords(id: string, keywords: string[]) {
    await this.prisma.orderPlan.update({
      where: { id },
      data: { keywords },
    });
  }
}

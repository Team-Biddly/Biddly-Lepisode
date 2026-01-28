import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import xlsx from 'xlsx';
import { OffsetPaginationDTO } from '../../libs';
import { PrismaService } from '../../prisma/prisma.service';
import { PreStandardDTO } from './dtos/pre-standard.dto';
import { SearchPreStandardDTO } from './dtos/search-pre-standard.dto';

@Injectable()
export class PreStandardService {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string) {
    const preStandard = await this.prisma.preStandard.findUnique({
      where: { id },
    });

    if (!preStandard) {
      throw new NotFoundException('사전규격을 찾을 수 없습니다.');
    }

    return preStandard;
  }

  async search(
    options: SearchPreStandardDTO,
  ): Promise<OffsetPaginationDTO<PreStandardDTO>> {
    const {
      pageNo,
      pageSize,
      startDate,
      endDate,
      type,
      query,
      budgetEndPrice,
      budgetStartPrice,
      담당자,
      발주기관,
      keywords,
      andKeywords,
      orKeywords,
      notKeywords,
      bookmarkUserId,
    } = options;

    const where: Prisma.PreStandardWhereInput = {};

    if (startDate && endDate) {
      where.등록일시 = {
        gte: dayjs(startDate).startOf('day').toDate(),
        lte: dayjs(endDate).endOf('day').toDate(),
      };
    }

    if (type) {
      where.업무구분명 = type;
    }

    if (query) {
      where.OR = [];
      where.OR.push(
        { 참조번호: { contains: query, mode: 'insensitive' } },
        { 품명: { contains: query, mode: 'insensitive' } },
      );
    }

    if (담당자) {
      where.담당자명 = { contains: 담당자, mode: 'insensitive' };
    }

    if (발주기관) {
      where.발주기관명 = { contains: 발주기관, mode: 'insensitive' };
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

    if (keywords) {
      where.keywords = { hasEvery: keywords };
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
        where: { userId: bookmarkUserId, modelName: '사전규격' },
        select: { modelId: true },
      });

      where.id = { in: bookmarks?.map((bookmark) => bookmark?.modelId) || [] };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.preStandard.findMany({
        where,
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
        orderBy: { 등록일시: 'desc' },
      }),
      this.prisma.preStandard.count({
        where,
      }),
    ]);

    return {
      items: plainToInstance(PreStandardDTO, items),
      pageInfo: {
        pageItems: items.length,
        pageNo,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  getLatestLog() {
    return this.prisma.syncLog.findFirst({
      where: { type: '사전규격' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExcelFile(ids: string[]): Promise<Buffer> {
    const preStandards = await this.prisma.preStandard
      .findMany({
        where: { id: { in: ids } },
        omit: { id: true },
        orderBy: { 등록일시: 'desc' },
      })
      .then((preStandards) =>
        plainToInstance(PreStandardDTO, preStandards, {
          exposeUnsetFields: false,
        }),
      )
      .then((preStandards) =>
        preStandards.map((preStandard, i) => ({
          No: i + 1,
          ...preStandard,
        })),
      );

    const worksheet = xlsx.utils.json_to_sheet(preStandards);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'PreStandards');

    const excelBuffer: Buffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    return excelBuffer;
  }

  async updateKeywords(id: string, keywords: string[]) {
    await this.prisma.preStandard.update({
      where: { id },
      data: { keywords },
    });
  }
}

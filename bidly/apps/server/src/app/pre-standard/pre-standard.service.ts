import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(PreStandardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFileFilename(url: string): Promise<string> {
    try {
      this.logger.debug(`Fetching filename for URL: ${url}`);
      const controller = new AbortController();
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      let filename = '첨부파일';

      const disposition = response.headers.get('content-disposition');
      this.logger.debug(`Content-Disposition: ${disposition}`);

      if (disposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          disposition,
        );
        this.logger.debug(`Regex matches: ${JSON.stringify(matches)}`);

        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
          try {
            filename = decodeURIComponent(filename);
            this.logger.debug(`Decoded filename: ${filename}`);
          } catch (_e) {
            this.logger.warn('Decoding failed', _e);
          }
        }
      } else {
        this.logger.warn('No content-disposition header found');
      }

      controller.abort();
      return filename;
    } catch (e) {
      this.logger.warn(`Failed to fetch filename for ${url}`, e);
      return '첨부파일';
    }
  }

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
          groups: ['detail'],
        }),
      )
      .then((preStandards) =>
        preStandards.map((preStandard, i) => {
          const { 담당자전화번호, ...rest } = preStandard;
          return {
            No: i + 1,
            ...rest,
            '담당자 이메일': '',
            연락처: 담당자전화번호 || '',
            의견등록마감일시: preStandard.의견등록마감일시
              ? new Date(preStandard.의견등록마감일시)
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')
              : undefined,
            납품기한일시: preStandard.납품기한일시
              ? new Date(preStandard.납품기한일시)
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')
              : undefined,
            접수일시: preStandard.접수일시
              ? new Date(preStandard.접수일시)
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')
              : undefined,
            등록일시: preStandard.등록일시
              ? new Date(preStandard.등록일시)
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')
              : undefined,
          };
        }),
      );

    const worksheet = xlsx.utils.json_to_sheet(preStandards);

    const maxColWidths: Record<string, number> = {};

    preStandards.forEach((preStandard) => {
      Object.keys(preStandard).forEach((key) => {
        const value = preStandard[key];
        const valueLength =
          value === null || value === undefined ? 0 : String(value).length;
        maxColWidths[key] = Math.max(
          maxColWidths[key] || 0,
          valueLength,
          key.length + 2,
        );
      });
    });

    worksheet['!cols'] = Object.keys(maxColWidths).map((key) => ({
      wch: Math.min(maxColWidths[key] + 5, 50),
    }));

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

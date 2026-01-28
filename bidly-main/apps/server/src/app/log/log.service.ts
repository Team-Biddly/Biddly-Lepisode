import { Injectable } from '@nestjs/common';
import { Log, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { LogSearchOptionDTO } from './dtos/log-search-option.dto';
import { OffsetPaginationDTO, PageInfoDTO } from '../../libs';
import { LogDTO } from './dtos/log.dto';
import { CreateLogDTO } from './dtos/create-log.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @name searchOffset
   * @description 로그를 오프셋 기반으로 조회합니다.
   * @param {LogSearchOptionDTO} option
   * @returns {Promise<OffsetPaginationDTO<LogDTO>>}
   */
  async searchOffset(
    option: LogSearchOptionDTO,
  ): Promise<OffsetPaginationDTO<LogDTO>> {
    return await this.prisma.$transaction(async (tx) => {
      const {
        query,
        pageNo,
        pageSize,
        adminId,
        targetId,
        targetModel,
        userId,
      } = option;

      const where: Prisma.LogWhereInput = {
        targetModel,
        AND: [],
      };

      if (targetId) {
        where.targetId = targetId;
      }

      if (userId) {
        where.userId = userId;
      }

      if (adminId) {
        (where.AND as Prisma.LogWhereInput[]).push({
          adminId,
        });
      }

      if (query) {
        (where.AND as Prisma.LogWhereInput[]).push({
          OR: [
            {
              content: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              admin: {
                name: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              admin: {
                email: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        });
      }

      const orderBy: Prisma.LogOrderByWithRelationInput = {};

      if (option.orderBy.includes('.')) {
        const [model, field] = option.orderBy.split('.');
        orderBy[model] = {
          [field]: option.align,
        };
      } else {
        orderBy[option.orderBy] = option.align;
      }

      const items: Log[] = await tx.log.findMany({
        where,
        orderBy: [orderBy],
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
        include: {
          admin: true,
        },
      });

      const count: number = await tx.log.count({ where });

      return {
        items: plainToInstance(LogDTO, items),
        pageInfo: plainToInstance(PageInfoDTO, {
          pageNo: pageNo,
          pageSize: option.pageSize,
          pageItems: items.length,
          totalPages: Math.ceil(count / option.pageSize),
          totalItems: count,
        }),
      };
    });
  }

  /**
   * @name create
   * @description 로그를 생성합니다.
   * @param {Log} log
   * @returns {Promise<LogDTO>}
   */
  async create(dto: CreateLogDTO): Promise<void> {
    const {
      action,
      content,
      targetId,
      targetModel,
      adminId,
      userId,
      targetChildId,
      targetChildModel,
    } = dto;

    await this.prisma.log.create({
      data: {
        action,
        content,
        targetId,
        targetModel,
        targetChildId,
        targetChildModel,
        adminId,
        userId,
      },
    });
  }
}

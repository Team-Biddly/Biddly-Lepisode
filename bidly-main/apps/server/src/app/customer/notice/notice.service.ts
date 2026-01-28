/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notice, Prisma } from '@prisma/client';
import { PrismaService } from 'apps/server/src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { NoticeDTO } from './dtos/notice.dto';
import { SearchNoticeDTO } from './dtos/search-notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dot';
import { OffsetPaginationDTO, PageInfoDTO } from 'apps/server/src/libs';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @name search
   * @description 공지사항을 검색 조회합니다.
   * @param {PaginationOptionDTO} options
   * @returns {Promise<OffsetPaginationDTO<NoticeDTO>>}
   */
  async search(
    options: SearchNoticeDTO,
  ): Promise<OffsetPaginationDTO<NoticeDTO>> {
    const { items, count } = await this.prisma.$transaction(async (tx) => {
      const where: Prisma.NoticeWhereInput = {};

      if (options?.query) {
        where.AND = [
          {
            OR: [
              {
                title: {
                  contains: options?.query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                content: {
                  contains: options?.query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          },
        ];
      }

      const items: Notice[] = await tx.notice.findMany({
        where,
        orderBy: [
          {
            isPinned: Prisma.SortOrder.desc,
          },
          {
            createdAt: Prisma.SortOrder.desc,
          },
        ],
        skip: (options.pageNo - 1) * options.pageSize,
        take: options.pageSize,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const count: number = await tx.notice.count({ where });

      const itemsWithRow: Notice[] = items.map((item, index) => {
        item['rowNumber'] =
          count - options.pageSize * (options.pageNo - 1) - index;
        return item;
      });

      return { items: itemsWithRow, count };
    });

    return {
      items: plainToInstance(NoticeDTO, items),
      pageInfo: plainToInstance(PageInfoDTO, {
        pageNo: options.pageNo,
        pageSize: options.pageSize,
        pageItems: items.length,
        totalPages: Math.ceil(count / options.pageSize),
        totalItems: count,
      }),
    };
  }

  /**
   * @name findAll
   * @description 공지사항 전체 조회
   * @returns {Promise<NoticeDTO[]>}
   */
  async findAll(): Promise<NoticeDTO[]> {
    const found = await this.prisma.notice.findMany({
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
    return plainToInstance(NoticeDTO, found);
  }

  /**
   * @name findById
   * @description 입력받은 ID와 일치하는 공지사항을 조회합니다.
   * @param {string} id
   * @returns {Promise<NoticeDTO>}
   */
  async findById(id: string): Promise<NoticeDTO> {
    const notice = await this.prisma.notice.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!notice)
      throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');

    return plainToInstance(NoticeDTO, notice);
  }

  /**
   * @name create
   * @description 공지사항을 생성합니다.
   * @param {CreateNoticeDTO} data
   * @returns {Promise<NoticeDTO>}
   */
  async create(data: CreateNoticeDTO, adminId: string): Promise<NoticeDTO> {
    const created = await this.prisma.notice.create({
      data: {
        ...data,
        admin: {
          connect: {
            id: adminId,
          },
        },
      },
    });
    return plainToInstance(NoticeDTO, created);
  }

  /**
   * @name update
   * @description 입력받은 ID와 일치하는 공지사항을 수정합니다.
   * @param {string} id
   * @param {UpdateNoticeDTO} data
   * @returns {Promise<NoticeDTO>}
   */
  async update(id: string, data: UpdateNoticeDTO): Promise<NoticeDTO> {
    const updated = await this.prisma.$transaction(async (tx) => {
      const notice = await tx.notice.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');

      const updated = await tx.notice.update({
        where: { id },
        data,
      });
      return updated;
    });
    return plainToInstance(NoticeDTO, updated);
  }

  /**
   * @name delete
   * @description 입력받은 ID와 일치하는 공지사항을 삭제합니다.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const notice = await tx.notice.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
      await tx.notice.delete({
        where: { id },
      });

      return true;
    });
  }

  /**
   * @name togglePinned
   * @description 입력받은 ID와 일치하는 공지사항의 고정여부를 수정합니다.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async togglePinned(id: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const notice = await tx.notice.findUnique({
        where: { id },
        select: { id: true, isPinned: true },
      });
      if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');

      await tx.notice.update({
        where: { id },
        data: {
          isPinned: !notice.isPinned,
        },
      });

      return true;
    });
  }
}

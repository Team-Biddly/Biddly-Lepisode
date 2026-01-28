import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFaqDTO } from './dtos/create-faq.dto';
import { SearchFaqDTO } from './dtos/search-faq.dto';
import { FaqSearchResponseDTO } from './dtos/faq-search-response.dto';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { FaqDTO } from './dtos/faq.dto';
import { PageInfoDTO } from '../../libs';
import { UpdateFaqDTO } from './dtos/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @name search
   * @description FAQ를 검색 조회합니다.
   * @param {PaginationOptionDTO} options
   * @returns {Promise<FaqSearchResponseDTO>}
   */
  async search(option: SearchFaqDTO): Promise<FaqSearchResponseDTO> {
    return await this.prisma.$transaction(async (tx) => {
      const { query, pageNo, pageSize } = option;

      const where: Prisma.FaqWhereInput = {
        deletedAt: null,
      };

      if (query) {
        where.AND = [
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                content: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          },
        ];
      }

      if (query) {
        where.OR = [
          {
            title: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            content: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ];
      }

      const items = await tx.faq.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          isPinned: true,
          createdAt: true,
          updatedAt: true,

          admin: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        where,
        orderBy: [
          {
            isPinned: Prisma.SortOrder.desc,
          },
          {
            createdAt: Prisma.SortOrder.desc,
          },
        ],
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
      });

      const count = await tx.faq.count({ where });

      const entities = items.map((item, index) => {
        item['rowNumber'] =
          count - option.pageSize * (option.pageNo - 1) - index;
        return item;
      });

      return {
        items: plainToInstance(FaqDTO, items),
        pageInfo: plainToInstance(PageInfoDTO, {
          pageNo: pageNo,
          pageSize: option.pageSize,
          pageItems: entities.length,
          totalPages: Math.ceil(count / option.pageSize),
          totalItems: count,
        }),
      };
    });
  }

  /**
   * @name create
   * @description FAQ를 생성합니다.
   * @param {CreateFaqDTO} data
   * @param {string} adminId
   * @returns {Promise<boolean>}
   */
  async create(data: CreateFaqDTO, adminId: string): Promise<boolean> {
    await this.prisma.faq.create({
      data: {
        ...data,
        admin: {
          connect: {
            id: adminId,
          },
        },
      },
    });
    return true;
  }

  /**
   * @name findById
   * @description 입력받은 ID와 일치하는 FAQ를 조회합니다.
   * @param {string} id
   * @returns {Promise<FaqDTO>}
   */
  async findById(id: string): Promise<FaqDTO> {
    const faq = await this.prisma.faq.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return plainToInstance(FaqDTO, faq);
  }

  /**
   * @name update
   * @description 입력받은 ID와 일치하는 FAQ를 수정합니다.
   * @param {string} id
   * @param {UpdateFaqDTO} data
   * @returns {Promise<boolean>}
   */
  async update(id: string, data: UpdateFaqDTO): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const faq = await tx.faq.findUnique({
        where: { id, deletedAt: null },
        select: { id: true },
      });
      if (!faq) throw new NotFoundException('FAQ를 찾을 수 없습니다.');

      await tx.faq.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return true;
    });
  }

  /**
   * @name togglePinned
   * @description 입력받은 ID와 일치하는 FAQ의 고정여부를 수정합니다.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async togglePinned(id: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const faq = await tx.faq.findUnique({
        where: { id, deletedAt: null },
        select: { id: true, isPinned: true },
      });
      if (!faq) throw new NotFoundException('FAQ를 찾을 수 없습니다.');

      const updated = await tx.faq.update({
        where: { id },
        data: {
          isPinned: !faq.isPinned,
        },
        select: {
          isPinned: true,
        },
      });

      return !!updated?.isPinned;
    });
  }

  /**
   * @name delete
   * @description 입력받은 ID와 일치하는 FAQ를 삭제합니다.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const faq = await tx.faq.findUnique({
        where: { id, deletedAt: null },
        select: { id: true },
      });
      if (!faq) throw new NotFoundException('FAQ를 찾을 수 없습니다.');
      await tx.faq.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return true;
    });
  }
}

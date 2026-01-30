import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import {
  OffsetPaginationDTO,
  OffsetSearchOptionDTO,
  PageInfoDTO,
} from '../../../libs/dtos';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInquiryDTO } from './dtos/create-inquiry.dto';
import { InquiryDTO } from './dtos/inquiry.dto';
import { UpdateInquiryDTO } from './dtos/update-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 1:1 문의 검색 조회
   * @param {PaginationOptionDTO} options
   * @returns {Promise<OffsetPaginationDTO<InquiryDTO>>}
   */
  async search(
    options: OffsetSearchOptionDTO,
  ): Promise<OffsetPaginationDTO<InquiryDTO>> {
    const { items, count } = await this.prismaService.$transaction(
      async (tx) => {
        const where: Prisma.InquiryWhereInput = {
          deletedAt: null,
        };

        if (options?.query) {
          where.AND = [
            {
              title: {
                contains: options?.query,
                mode: Prisma.QueryMode.insensitive,
              },
              content: {
                contains: options?.query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ];
        }

        const items = await tx.inquiry.findMany({
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            answer: true,
            answeredAt: true,
            user: {
              select: {
                id: true,
                name: true,
                nickname: true,
                createdAt: true,
              },
            },
          },
          where,
          orderBy: {
            [options.orderBy]: options.align,
          },
          skip: (options.pageNo - 1) * options.pageSize,
          take: options.pageSize,
        });

        const count = await tx.inquiry.count({ where });

        const itemsWithRow = items.map((item, index) => {
          item['rowNumber'] =
            count - options.pageSize * (options.pageNo - 1) - index;
          return item;
        });

        return { items: itemsWithRow, count };
      },
    );

    return {
      items: plainToInstance(InquiryDTO, items),
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
   * 1:1 문의 전체 조회
   * @returns {Promise<InquiryDTO[]>}
   */
  async findAll(): Promise<InquiryDTO[]> {
    const found = await this.prismaService.inquiry.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        answer: true,
        answeredAt: true,
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            createdAt: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
    return plainToInstance(InquiryDTO, found);
  }

  /**
   * 1:1 문의 상세 조회
   * @param {string} id
   * @returns {Promise<InquiryDTO>}
   */
  async findById(id: string): Promise<InquiryDTO> {
    return await this.prismaService.$transaction(async (tx) => {
      const check = await tx.inquiry.exists({ id });

      if (!check)
        throw new NotFoundException('해당 1:1 문의를 찾을 수 없습니다.');

      const inquiry = await tx.inquiry.findUnique({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          answer: true,
          answeredAt: true,
          user: {
            select: {
              id: true,
              name: true,
              nickname: true,
              createdAt: true,
            },
          },
        },
        where: { id, deletedAt: null },
      });

      return plainToInstance(InquiryDTO, inquiry);
    });
  }

  /**
   * 1:1 문의 등록
   * @param {CreateInquiryDTO} data
   * @param {string} userId
   * @returns {Promise<InquiryDTO>}
   */
  async create(data: CreateInquiryDTO, userId: string): Promise<InquiryDTO> {
    const { content, title } = data;
    const created = await this.prismaService.inquiry.create({
      data: {
        content,
        title,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return plainToInstance(InquiryDTO, created);
  }

  /**
   * 1:1 문의 수정
   * @param {string} id
   * @param {UpdateInquiryDTO} data
   * @param {string} userId
   * @returns {Promise<InquiryDTO>}
   */
  async update(
    id: string,
    data: UpdateInquiryDTO,
    userId: string,
  ): Promise<InquiryDTO> {
    return await this.prismaService.$transaction(async (tx) => {
      const check = await tx.inquiry.exists({ id });

      if (!check)
        throw new NotFoundException('해당 1:1 문의를 찾을 수 없습니다.');

      const inquiry = await tx.inquiry.findUnique({
        select: {
          id: true,
          userId: true,
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      if (inquiry.userId !== userId)
        throw new BadRequestException('올바르지 않은 요청입니다.');

      const updated = await tx.inquiry.update({
        where: { id },
        data: {
          title: data?.title,
          content: data?.content,
        },
      });

      return plainToInstance(InquiryDTO, updated);
    });
  }

  /**
   * 문의사항 답변
   * @param {string} id
   * @param {UpdateInquiryDTO} data
   * @param {string} adminId
   * @returns {Promise<InquiryDTO>}
   */
  async answer(
    id: string,
    data: UpdateInquiryDTO,
    userId: string,
  ): Promise<InquiryDTO> {
    return await this.prismaService.$transaction(async (tx) => {
      const check = await tx.inquiry.exists({ id });

      if (!check)
        throw new NotFoundException('해당 1:1 문의를 찾을 수 없습니다.');

      const updated = await tx.inquiry.update({
        where: { id },
        data: {
          answer: data.answer,
          answeredAt: new Date(),
          userId,
        },
      });
      return plainToInstance(InquiryDTO, updated);
    });
  }

  /**
   * 1:1 문의 삭제
   * @param {string} id
   * @param {string} adminId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async delete(
    id: string,
    adminId?: string,
    userId?: string,
  ): Promise<boolean> {
    if (!adminId && !userId)
      throw new BadRequestException('올바르지 않은 요청입니다.');

    return this.prismaService.$transaction(async (tx) => {
      const check = await tx.inquiry.exists({ id });

      if (!check)
        throw new NotFoundException('해당 1:1 문의를 찾을 수 없습니다.');

      const inquiry = await tx.inquiry.findUnique({
        select: { id: true, userId: true },
        where: { id },
      });

      if (userId && inquiry.userId !== userId)
        throw new BadRequestException('올바르지 않은 요청입니다.');

      await tx.inquiry.update({
        data: {
          deletedAt: new Date(),
        },
        where: { id },
      });

      return true;
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Admin, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../../prisma/prisma.service';
import { BannerCreateDTO } from '../dtos/banner.create.dto';
import { BannerDTO } from '../dtos/banner.dto';
import { BannerReorderDTO } from '../dtos/banner.reorder.dto';
import { BannerSearchResponseDTO } from '../dtos/banner.search-response.dto';
import { BannerSearchDTO } from '../dtos/banner.search.dto';
import { BannerUpdateDTO } from '../dtos/banner.update.dto';

@Injectable()
export class BannerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * @name search
   * @description Search banners with filters and pagination.
   * @param {BannerSearchDTO} params
   * @returns {Promise<BannerSearchResponseDTO>}
   */
  async search(params: BannerSearchDTO): Promise<BannerSearchResponseDTO> {
    const {
      query,
      isExposed,
      startCreatedAt,
      endCreatedAt,
      pageNo,
      pageSize,
      mode,
    } = params;

    const where: Prisma.BannerWhereInput = {};
    const AND: Prisma.BannerWhereInput[] = [];

    if (query) {
      AND.push({
        OR: [
          { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      });
    }

    if (isExposed !== undefined) {
      AND.push({ isExposed });
    }

    if (startCreatedAt) {
      AND.push({ createdAt: { gte: startCreatedAt } });
    }

    if (endCreatedAt) {
      AND.push({ createdAt: { lte: endCreatedAt } });
    }

    if (mode) {
      if (mode === '웹용') {
        AND.push({
          pcImage: { isNot: null },
        });
      }

      if (mode === '모바일용') {
        AND.push({
          mobileImage: { isNot: null },
        });
      }
    }

    if (AND.length) where.AND = AND;

    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;

    const entities = await this.prisma.banner.findMany({
      where,
      take,
      skip,
      orderBy: { order: Prisma.SortOrder.asc },
      select: {
        id: true,
        order: true,
        isExposed: true,
        title: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        pcImage: true,
        mobileImage: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    let newOrder = 1;
    const items = entities.map((item) => ({
      ...item,
      order: newOrder++,
      rowNumber: newOrder - 1,
    }));

    const totalItems = await this.prisma.banner.count({ where });

    return {
      items: plainToInstance(BannerDTO, items),
      pageInfo: {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems,
        pageItems: items.length,
      },
    };
  }

  /**
   * @name findUnique
   * @description Find a banner by its ID.
   * @param {string} id
   * @returns {Promise<BannerDTO>}
   */
  async findById(id: string): Promise<BannerDTO> {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
      select: {
        id: true,
        order: true,
        isExposed: true,
        title: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        pcImage: true,
        mobileImage: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return plainToInstance(BannerDTO, banner);
  }

  /**
   * @name create
   * @description Create a new banner.
   * @param {BannerCreateDTO} data
   * @param {Admin} admin
   * @returns {Promise<boolean>}
   */
  async create(data: BannerCreateDTO, admin: Admin): Promise<boolean> {
    const maxOrder = await this.prisma.banner.findFirst({
      orderBy: { order: Prisma.SortOrder.desc },
      select: { order: true },
    });

    const { pcImage, mobileImage, mode, ...bannerData } = data;

    const order = maxOrder ? (maxOrder.order || 0) + 1 : 1;

    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.banner.create({
        data: {
          ...bannerData,
          order,
          admin: {
            connect: { id: admin.id },
          },
        },
      });

      if (pcImage && mode === '웹용') {
        const pc = pcImage[0];
        if (pc && pc.url) {
          await tx.file.upsert({
            where: { url: pc.url },
            update: { bannerPCImageId: created.id },
            create: {
              url: pc.url,
              mimeType: pc.mimeType ?? 'image/webp',
              name: pc.name,
              size: pc.size,
              bannerPCImageId: created.id,
            },
          });
        }
      }

      if (mobileImage && mode === '모바일용') {
        const mobile = mobileImage[0];
        if (mobile && mobile.url) {
          await tx.file.upsert({
            where: { url: mobile.url },
            update: { bannerMobileImageId: created.id },
            create: {
              url: mobile.url,
              mimeType: mobile.mimeType ?? 'image/webp',
              name: mobile.name,
              size: mobile.size,
              bannerMobileImageId: created.id,
            },
          });
        }
      }

      return true;
    });
  }

  /**
   * @name update
   * @description Update an existing banner.
   * @param {string} id
   * @param {BannerUpdateDTO} data
   * @param {Admin} admin
   * @returns {Promise<boolean>}
   */
  async update(
    id: string,
    data: BannerUpdateDTO,
    admin: Admin,
  ): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const exists = await tx.banner.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) throw new NotFoundException('Banner not found');

      await tx.banner.update({
        where: { id },
        data: {
          title: data.title,
          url: data.url,
          isExposed: data.isExposed,
        },
      });

      if (data.pcImage && data.pcImage[0]?.url) {
        await tx.file.updateMany({
          where: { bannerPCImageId: id },
          data: { bannerPCImageId: null },
        });
        const pc = data.pcImage[0];
        if (pc && pc.url) {
          await tx.file.upsert({
            where: { url: pc.url },
            update: { bannerPCImageId: id },
            create: {
              url: pc.url,
              mimeType: pc.mimeType ?? 'image/webp',
              name: pc.name,
              size: pc.size,
              bannerPCImageId: id,
            },
          });
        }
      }

      if (data.mobileImage && data.mobileImage[0]?.url) {
        await tx.file.updateMany({
          where: { bannerMobileImageId: id },
          data: { bannerMobileImageId: null },
        });
        const mobile = data.mobileImage[0];
        if (mobile && mobile.url) {
          await tx.file.upsert({
            where: { url: mobile.url },
            update: { bannerMobileImageId: id },
            create: {
              url: mobile.url,
              mimeType: mobile.mimeType ?? 'image/webp',
              name: mobile.name,
              size: mobile.size,
              bannerMobileImageId: id,
            },
          });
        }
      }

      return true;
    });
  }

  /**
   * @name reorder
   * @description Reorder banners based on the provided parameters
   * @param {BannerReorderDTO} option
   * @param {Admin} admin
   * @returns {Promise<boolean>}
   */
  async reorder(option: BannerReorderDTO, admin: Admin): Promise<boolean> {
    let { current } = option;
    const { prev, mode } = option;

    // mode 조건 명확화
    const modeCondition =
      mode === '웹용'
        ? { pcImage: { isNot: null } }
        : { mobileImage: { isNot: null } };

    // 이동 대상 찾기
    const toBeMoved = await this.prisma.banner.findFirst({
      where: {
        order: prev + 1,
        ...modeCondition,
      },
      select: { id: true, order: true },
    });
    current += 1;
    if (!toBeMoved) throw new NotFoundException('banner to be moved not found');

    // 동시성 문제 방지: 트랜잭션 내에서만 처리
    return await this.prisma.$transaction(async (tx) => {
      // 전체 배너 목록을 mode별로 가져옴
      const allItems = await tx.banner.findMany({
        where: modeCondition,
        orderBy: { order: Prisma.SortOrder.asc },
      });

      // 순서 재정렬: 이동 대상과 나머지의 order를 재배치
      const banners = [...allItems];
      const fromIdx = banners.findIndex((b) => b.order === prev + 1);
      if (fromIdx === -1) throw new NotFoundException('banner index not found');
      const moved = banners.splice(fromIdx, 1)[0];
      // current는 1-based order, index는 0-based이므로 -1
      banners.splice(current - 1, 0, moved);

      // 불필요한 업데이트 최소화
      for (let i = 0; i < banners.length; i++) {
        if (banners[i].order !== i + 1) {
          await tx.banner.update({
            where: { id: banners[i].id },
            data: { order: i + 1 },
          });
        }
      }
      return true;
    });
  }

  /**
   * @name delete
   * @description Delete a banner by its ID.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    await this.prisma.banner.delete({
      where: { id },
      select: { id: true, title: true },
    });

    return true;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { Menu, Prisma } from '@prisma/client';
import { CursorPaginationDTO } from '../../../libs/dtos/cursor-pagination.dto';
import { OffsetPaginationDTO } from '../../../libs/dtos/offset-pagination.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMenuDTO } from '../dtos/create-menu.dto';
import {
  MenuCursorSearchOptionDTO,
  MenuSearchOffsetOptionDTO,
} from '../dtos/search-menu.dto';
import { UpdateMenuDTO } from '../dtos/update-menu.dto';
import { FindMenuDTO } from '../dtos/find-menu.dto';
import { MAX_DEPTH } from '@common';

@Injectable()
export class MenuService {
  maxDepth: number = MAX_DEPTH;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 메뉴 오프셋 기반 조회
   * @param {MenuSearchOffsetOptionDTO} option 메뉴 검색 옵션
   * @returns {Promise<OffsetPaginationDTO>} 메뉴 정보
   */
  async searchOffset(
    option: MenuSearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO<Menu>> {
    const { pageNo, pageSize, query, orderBy, align } = option;

    const where: Prisma.MenuWhereInput = {};

    // @todo: 쿼리 조건 추가
    if (query) {
      where.OR = [];
    }

    // @todo: AND 조건 추가
    where.AND = [];

    const items = await this.prisma.menu.findMany({
      where,
      orderBy: { [orderBy || 'createdAt']: align || 'desc' },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
      // include: {},  @todo 종속된 엔티티를 가져오는 경우 사용
    });

    const count = await this.prisma.menu.count({ where });

    return {
      items,
      pageInfo: {
        pageNo: option.pageNo,
        pageSize: option.pageSize,
        totalPages: Math.ceil(count / option.pageSize),
        totalItems: count,
        pageItems: items.length,
      },
    };
  }

  /**
   * 메뉴 커서 기반 조회
   * @param {MenuCursorSearchOptionDTO} option 메뉴 검색 옵션
   * @returns {Promise<CursorPaginationDTO>} 메뉴 정보
   */
  async searchCursor(
    option: MenuCursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO<Menu>> {
    const { cursor, pageSize, query, orderBy, align } = option;

    const where: Prisma.MenuWhereInput = {}; // @todo: 검색 조건 추가

    // @todo: 쿼리 조건 추가
    if (query) {
      where.OR = [];
    }

    // @todo: AND 조건 추가
    where.AND = [];

    const items = await this.prisma.menu.findMany({
      where,
      orderBy: { [orderBy || 'createdAt']: align || 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      // include: {},  @todo 종속된 엔티티를 가져오는 경우 사용
    });

    const hasNext = items.length > pageSize;

    const result = {
      items: items.slice(0, pageSize),
      nextCursor: undefined,
      hasNext,
    };

    if (hasNext) result.nextCursor = items.at(-1)?.id;

    return result;
  }

  /**
   * 부모 메뉴 ID로 하위 메뉴를 조회합니다.
   * @param parentId
   * @returns
   */
  findAllByParentId(parentId: string) {
    return this.prisma.menu.findMany({
      where: {
        parentId,
      },
    });
  }

  async findAll(option: FindMenuDTO, depth = this.maxDepth) {
    const { query } = option;
    const where: Prisma.MenuWhereInput = {
      parent: null,
    };
    const OR: Prisma.MenuWhereInput[] = [];

    if (query) {
      OR.push(
        {
          name: {
            contains: query,
          },
        },
        {
          routeUrl: {
            contains: query,
          },
        },
        {
          apiUrl: {
            contains: query,
          },
        },
      );
    }

    const getChildrenInclude = (level: number): any => {
      if (level <= 0) return {}; // depth 제한

      return {
        children: {
          include: getChildrenInclude(level - 1),
        },
        permissions: {
          include: {
            role: true,
          },
        },
      };
    };

    return this.prisma.menu.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        ...getChildrenInclude(depth),
      },
    });
  }

  /**
   * 부모 메뉴만 조회합니다.
   * @returns
   */
  findAllParent() {
    const input: Prisma.MenuFindManyArgs = {
      where: { parent: null },
      orderBy: { name: 'asc' },
    };

    if (this.maxDepth) {
      // include children recursively by depth
      let depth = 1;
      let current = input;
      while (depth < this.maxDepth) {
        current['include'] = {
          children: {
            orderBy: { name: 'asc' },
            include: { _count: { select: { permissions: true } } },
          },
        };
        current = current['include'].children as any;
        depth++;
      }
    }

    return this.prisma.menu.findMany(input);
  }

  /**
   * 자식 메뉴만 조회합니다.
   * @returns
   */
  findAllChild() {
    return this.prisma.menu.findMany({
      where: { parent: { isNot: null } },
      orderBy: { name: 'asc' },
    });
  }

  findById(id: string) {
    const getChildrenInclude = (level: number): any => {
      if (level <= 0) return {}; // depth 제한

      return {
        parent: {
          include: {
            permissions: {
              include: {
                role: true,
              },
            },
          },
        },
        children: {
          include: getChildrenInclude(level - 1),
        },
        permissions: {
          include: {
            role: true,
          },
        },
      };
    };

    return this.prisma.menu.findUnique({
      where: { id },
      include: {
        _count: true,
        children: {
          orderBy: { name: 'asc' },
          include: {
            ...getChildrenInclude(this.maxDepth),
          },
        },
      },
    });
  }

  async create(body: CreateMenuDTO) {
    const { parentId } = body;

    return this.prisma.$transaction(async (tx) => {
      if (parentId) {
        const parent = await tx.menu.findUnique({
          where: { id: parentId },
          include: { _count: true, parent: true },
        });

        if (!parent) {
          throw new BadRequestException('올바르지 않은 메뉴가 선택되었습니다.');
        }

        if (this.maxDepth) {
          let current = parent as any;
          let depth = 1;
          while (current.parent) {
            current = await tx.menu.findUnique({
              where: { id: current.parentId },
              include: { parent: true },
            });
            depth++;
          }

          if (depth >= this.maxDepth) {
            throw new BadRequestException(
              `최대 ${this.maxDepth}단계 까지만 등록할 수 있습니다.`,
            );
          }
        }

        const input: Prisma.MenuCreateInput = {
          name: body.name,
          routeUrl: body.routeUrl,
          apiUrl: body.apiUrl,
          parent: { connect: { id: parent.id } },
        };

        return tx.menu.create({
          data: input,
        });
      } else {
        const count = await tx.menu.count({
          where: { parent: null },
        });

        const input: Prisma.MenuCreateInput = {
          name: body.name,
          routeUrl: body.routeUrl,
          apiUrl: body.apiUrl,
        };

        return tx.menu.create({
          data: input,
        });
      }
    });
  }

  /**
   * 입력한 ID와 일치하는 콘텐츠 메뉴를 수정합니다.
   * @param id
   * @param body
   */
  update(id: string, body: UpdateMenuDTO) {
    const { parentId, ...data } = body;

    return this.prisma.$transaction(async (tx) => {
      const input: Prisma.MenuUpdateInput = {
        ...data,
      };

      if (parentId) {
        input.parent = {
          connect: { id: parentId },
        };
      }

      return tx.menu.update({
        where: { id },
        data: input,
      });
    });
  }

  copy(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.menu.findUnique({
        where: { id },
        include: {
          parent: true,
          children: {
            include: {
              children: {
                include: {
                  children: true,
                },
              },
            },
          },
        },
      });

      if (!category)
        throw new BadRequestException('존재하지 않는 메뉴 입니다.');

      const input: Prisma.MenuCreateInput = {
        name: category.name + `의 복사본`,
      };

      if (category.parent) {
        input.parent = {
          connect: {
            id: category.parent.id,
          },
        };
      }

      const result = await tx.menu.create({
        data: input,
      });

      await this.copyCreate(tx, result.id, category);

      return;
    });
  }

  private async copyCreate(tx: any, resultId: string, category: any) {
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        const result = await tx.contentCategory.create({
          data: {
            name: child.name,
            order: child.order,
            parent: {
              connect: {
                id: resultId,
              },
            },
          },
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        });

        await this.copyCreate(tx, result.id, child);
      }
    }
  }

  delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const contentCategory = await tx.menu.findUnique({
        where: { id },
        include: { permissions: true, children: true },
      });

      if (!contentCategory)
        throw new BadRequestException('존재하지 않는 콘텐츠 메뉴입니다.');

      if (contentCategory.permissions.length > 0)
        throw new BadRequestException(
          '등록된 하위 메뉴가 있는 상위 메뉴는 삭제할 수 없습니다..',
        );

      return tx.menu.delete({
        where: { id },
      });
    });
  }
}

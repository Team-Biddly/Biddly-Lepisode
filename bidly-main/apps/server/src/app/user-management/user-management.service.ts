import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
// import {
//   UserCursorSearchOptionDTO,
//   UserSearchOffsetOptionDTO,
// } from '../user/dtos/search-user.dto';
import { CursorPaginationDTO, OffsetPaginationDTO } from '../../libs';
import { Prisma, User } from '@prisma/client';
import { getOrderBy } from '../../libs/util/orderby.util';

@Injectable()
export class UserManagementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자를 오프셋 기반으로 조회합니다.
   * @param {UserSearchOffsetOptionDTO} option 사용자 검색 옵션
   * @returns {Promise<OffsetPaginationDTO<User>>} 사용자 정보
   */
  async searchOffset(option): Promise<OffsetPaginationDTO<User>> {
    const { pageNo, pageSize, query, orderBy, align, roleId } = option;

    const where: Prisma.UserWhereInput = {}; // @todo: 검색 조건 추가
    const OR: Prisma.UserWhereInput[] = [];

    if (query) {
      OR.push({
        auths: {
          some: {
            email: {
              contains: query,
            },
          },
        },
      });
    }

    if (roleId) {
      where.permission = {
        roleId,
      };
    }

    if (OR.length > 0) {
      where.OR = OR;
    }

    const items = await this.prisma.user.findMany({
      where,
      orderBy: getOrderBy(orderBy, align),
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
      include: {
        permission: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        withdrawnLogs: true,
        blockLogs: true,
      },
    });

    const count = await this.prisma.user.count({ where });

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
   * 사용자를 커서 기반으로 조회합니다.
   * @param {UserCursorSearchOptionDTO} option 사용자 검색 옵션
   * @returns {Promise<CursorPaginationDTO>} 사용자 정보
   */
  async searchCursor(option): Promise<CursorPaginationDTO<User>> {
    const { cursor, pageSize, query, orderBy, align } = option;

    const where: Prisma.UserWhereInput = {}; // @todo: 검색 조건 추가

    if (query) {
      where.OR = [
        {
          auths: {
            some: {
              email: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    const items = await this.prisma.user.findMany({
      where,
      orderBy: { [orderBy || 'createdAt']: align || 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        withdrawnLogs: true,
        blockLogs: true,
      },
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
   * 회원을 ID 기반으로 조회합니다.
   * @returns {Promise<User[]>} 사용자 정보
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        permission: {
          include: {
            role: true,
          },
        },
        auths: {
          where: {
            provider: 'EMAIL',
          },
          omit: {
            password: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 생성
   * @param body
   * @returns
   */
  async create(body: CreateUserDTO) {
    if (!body.permissionId) {
      throw new BadRequestException('권한을 설정해주세요.');
    }

    const superAdmin = await this.prisma.user.create({
      data: {
        name: body.name,
        contact: body.contact || undefined,
        nickname: body.nickname || body.name,
        email: body.email,
        auths: {
          create: {
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            provider: 'EMAIL',
          },
        },
        permission: {
          connect: {
            id: body.permissionId,
          },
        },
      },
    });

    return superAdmin;
  }

  async update(id: string, body: CreateUserDTO) {
    if (!body.permissionId) {
      throw new BadRequestException('권한을 설정해주세요.');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        contact: body.contact,
        nickname: body.nickname || body.name,
        permission: {
          connect: {
            id: body.permissionId,
          },
        },
      },
      include: {
        auths: {
          where: {
            provider: 'EMAIL',
          },
        },
      },
    });

    const auth = user.auths[0];
    await this.prisma.auth.update({
      where: {
        id: auth.id,
      },
      data: {
        email: body.email,
        password: body.password
          ? await bcrypt.hash(body.password, 10)
          : undefined,
      },
    });

    return user;
  }

  /**
   * 사용자를 삭제합니다.
   * @param {string} id  사용자 ID
   * @returns {Promise<User>} 삭제된 사용자 정보
   */
  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}

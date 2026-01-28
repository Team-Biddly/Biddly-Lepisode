import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDTO, UpdateRoleDTO } from './dtos/create-role.dto';
import {
  CreateRoleLevelPermissionDTO,
  UpdateRoleLevelPermissionDTO,
} from './dtos/create-permission.dto';
import { MAX_LEVEL } from '@common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRoleService {
  /**
   *  최대 레벨 설정
   */
  maxLevel = MAX_LEVEL;

  constructor(private readonly prisma: PrismaService) {
    this.setDefaultRole();
  }

  /**
   *  기본 역할 설정
   */
  async setDefaultRole() {
    const defaults = await this.prisma.role.findMany({
      where: {
        default: true,
      },
    });

    if (!defaults || !defaults.length) {
      await this.prisma.role.create({
        data: {
          name: '관리자',
          default: true,
          permissions: {
            create: {
              default: true,
              level: this.maxLevel,
              permission: '최고 관리자',
              description: '모든 권한을 가집니다.',
            },
          },
        },
      });
    }
  }

  /**
   * 역할 조회
   * @returns
   */
  findAll(query?: string) {
    const where: Prisma.RoleWhereInput = {};

    if (query) {
      where.OR = [
        {
          name: {
            contains: query,
          },
        },
        {
          permissions: {
            some: {
              permission: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    return this.prisma.role.findMany({
      where,
      include: {
        permissions: true,
      },
    });
  }

  /**
   * 역할을 생성합니다.
   * @param body
   */
  createRole(body: CreateRoleDTO) {
    return this.prisma.role.create({
      data: {
        ...body,
      },
    });
  }

  /**
   * 권한을 생성합니다.
   * @param body
   */
  async createPermission(body: CreateRoleLevelPermissionDTO) {
    const { roleId, ...data } = body;

    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      throw new NotFoundException('역할을 찾을 수 없습니다.');
    }

    return this.prisma.roleLevelPermission.create({
      data: {
        role: {
          connect: {
            id: roleId,
          },
        },
        ...data,
      },
    });
  }

  /**
   * 역할 수정
   * @param id
   * @param body
   * @returns
   */
  async updateRole(id: string, body: UpdateRoleDTO) {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
  }

  /**
   * 권한 수정
   * @param id
   * @param body
   * @returns
   */
  async updatePermission(id: string, body: UpdateRoleLevelPermissionDTO) {
    const { roleId, ...data } = body;

    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      throw new NotFoundException('역할을 찾을 수 없습니다.');
    }

    return this.prisma.roleLevelPermission.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  /**
   * 역할 삭제
   * @param id
   * @returns
   */
  async deleteRole(id: string) {
    return this.prisma.role.delete({
      where: {
        id,
      },
    });
  }

  /**
   * 권한 삭제
   * @param id
   * @returns
   */
  async deletePermission(id: string) {
    return this.prisma.roleLevelPermission.delete({
      where: {
        id,
      },
    });
  }
}

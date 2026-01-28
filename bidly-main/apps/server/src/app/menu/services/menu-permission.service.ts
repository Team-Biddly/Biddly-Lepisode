import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'apps/server/src/prisma/prisma.service';
import { CreateMenuPermissionDTO } from '../dtos/create-menu-permission.dto';

@Injectable()
export class MenuPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(menuId: string, body: CreateMenuPermissionDTO) {
    const { roleId, ...data } = body;

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('역할을 찾을 수 없습니다.');
      }

      const menu = await tx.menu.findUnique({
        where: { id: menuId },
      });
      if (!menu) {
        throw new NotFoundException('메뉴를 찾을 수 없습니다.');
      }

      return tx.menuPermission.create({
        data: {
          ...data,
          menu: {
            connect: {
              id: menuId,
            },
          },
          role: {
            connect: {
              id: roleId,
            },
          },
        },
      });
    });
  }

  async update(id: string, body: CreateMenuPermissionDTO) {
    const { roleId, ...data } = body;

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('역할을 찾을 수 없습니다.');
      }

      return tx.menuPermission.update({
        where: { id },
        data: {
          ...data,
          role: {
            connect: {
              id: roleId,
            },
          },
        },
      });
    });
  }

  async delete(id: string) {
    return this.prisma.menuPermission.delete({
      where: { id },
    });
  }
}

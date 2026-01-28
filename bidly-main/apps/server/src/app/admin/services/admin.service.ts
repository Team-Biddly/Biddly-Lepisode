import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAdminDTO } from '../dtos/create-admin.dto';
import { hashSync } from 'bcryptjs';
import { Admin, AdminRole, Prisma } from '@prisma/client';
import { PageInfoDTO, OffsetSearchOptionDTO } from '../../../libs';
import { AdminSearchResponseDTO } from '../dtos/admin-search-response.dto';
import { plainToInstance } from 'class-transformer';
import { AdminDTO } from '../dtos/admin.dto';
import { UpdateAdminDTO } from '../dtos/update-admin.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    await this.prisma.admin.upsert({
      where: {
        id: 'A00000000',
      },
      create: {
        id: 'A00000000',
        email: process.env.DEFAULT_ADMIN_USERNAME,
        name: process.env.DEFAULT_ADMIN_NAME || 'Default Admin',
        password: hashSync(process.env.DEFAULT_ADMIN_PASSWORD, 10),
        role: AdminRole.SUPER_ADMIN,
      },
      update: {
        email: process.env.DEFAULT_ADMIN_USERNAME,
        name: process.env.DEFAULT_ADMIN_NAME || 'Default Admin',
        password: hashSync(process.env.DEFAULT_ADMIN_PASSWORD, 10),
        role: AdminRole.SUPER_ADMIN,
      },
    });

    this.logger.debug('기본 관리자가 생성되었습니다.');
  }

  /**
   * 회원을 ID 기반으로 조회합니다.
   * @returns {Promise<User[]>} 사용자 정보
   */
  async findById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return await this.prisma.admin.findUnique({
      where: { id },
      include: {
        blockedLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          where: {
            until: { gte: new Date() },
          },
        },
      },
    });
  }

  /**
   * @name create
   * @description ADMIN을 생성합니다.
   * @param {CreateAdminDTO} data
   * @returns {Promise<boolean>}
   */
  async create(data: CreateAdminDTO): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const found = await tx.admin.findUnique({
        where: {
          email: data?.email,
        },
      });

      if (found) throw new BadRequestException('이미 존재하는 이메일입니다.');
      if (data.password !== data.passwordConfirm)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      await tx.admin.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashSync(data.password, 10),
        },
      });

      return true;
    });
  }

  /**
   * @name findByEmail
   * @description 입력한 이메일에 해당하는 관리자를 조회합니다.
   * @param {string} email - 관리자 이메일
   * @return {Promise<Admin>} 관리자 정보
   */
  async findByEmail(email: string) {
    const check = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (!check) {
      throw new NotFoundException('관리자를 찾을 수 없습니다.');
    }

    return await this.prisma.admin.findUnique({
      where: { email },
      include: {
        blockedLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          where: {
            until: { gte: new Date() },
          },
        },
      },
    });
  }

  /**
   * @name searchOffset
   * @description 관리자 계정을 오프셋 기반으로 조회합니다.
   * @param {OffsetSearchOptionDTO} option
   * @returns {Promise<AdminSearchResponseDTO>}
   */
  async searchOffset(
    option: OffsetSearchOptionDTO,
  ): Promise<AdminSearchResponseDTO> {
    return await this.prisma.$transaction(async (tx) => {
      const { query, pageNo, pageSize } = option;

      const where: Prisma.AdminWhereInput = {
        deletedAt: null,
        AND: [],
      };

      if (query) {
        (where.AND as Prisma.AdminWhereInput[]).push({
          OR: [
            {
              email: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        });
      }

      const items = await tx.admin.findMany({
        where,
        orderBy: [
          {
            [option.orderBy]: option.align,
          },
        ],
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
      });

      const count: number = await tx.admin.count({ where });
      const entities = items?.map((item, index) => {
        item['rowNumber'] =
          count - option.pageSize * (option.pageNo - 1) - index;
        return item;
      });

      return {
        items: plainToInstance(AdminDTO, entities),
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
   * @name update
   * @description 관리자 정보 수정
   * @param {string} id
   * @param {string} data
   * @param {string} adminId
   * @returns {Promise<boolean>}
   */
  async update(
    id: string,
    data: UpdateAdminDTO,
    adminId: string,
  ): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      if (id !== adminId) {
        const admin = await tx.admin.findUnique({
          select: {
            role: true,
          },
          where: {
            id: adminId,
          },
        });

        if (!admin) throw new BadRequestException('올바르지 않은 접근입니다.');
        if (admin.role !== AdminRole.SUPER_ADMIN)
          throw new BadRequestException('권한이 없습니다.');
      }

      const found = await tx.admin.findUnique({
        select: {
          id: true,
          email: true,
        },
        where: {
          id,
        },
      });

      if (!found)
        throw new NotFoundException('해당 관리자를 찾을 수 없습니다.');

      if (data.password !== data.passwordConfirm)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      if (data?.email !== found?.email) {
        const check = await tx.admin.count({
          where: {
            email: data.email,
          },
        });

        if (check > 0)
          throw new BadRequestException('이미 존재하는 이메일입니다.');
      }

      await tx.admin.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          ...(data.password ? { password: hashSync(data.password, 10) } : {}),
        },
      });

      return true;
    });
  }

  /**
   * @name updateMyInfo
   * @description 내 정보 수정
   * @param {UpdateAdminDTO} data
   * @param {string} adminId
   * @returns {Promise<boolean>}
   */
  async updateMyInfo(data: UpdateAdminDTO, adminId: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.findUnique({
        where: { id: adminId },
      });
      if (!admin) throw new NotFoundException('관리자를 찾을 수 없습니다.');

      if (data.password !== data.passwordConfirm)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      await tx.admin.update({
        where: { id: adminId },
        data: {
          email: data.email,
          name: data.name,
          ...(data.password ? { password: hashSync(data.password, 10) } : {}),
        },
      });

      return true;
    });
  }

  /**
   * @name setRefreshToken
   * @description 입력한 ID에 해당하는 관리자의 리프레시 토큰을 설정합니다.
   * @param refreshToken
   * @returns {Promise<void>}
   */
  async setRefreshToken(id: string, refreshToken: string) {
    const check = await this.prisma.admin.findUnique({ where: { id } });
    if (!check) {
      throw new NotFoundException('관리자를 찾을 수 없습니다.');
    }

    return this.prisma.admin.update({
      where: { id },
      data: { refreshToken },
    });
  }

  /**
   * @name delete
   * @description 입력받은 ID와 일치하는 ADMIN을 삭제합니다.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.findUnique({
        where: { id, deletedAt: null },
        select: { id: true },
      });
      if (!admin) throw new NotFoundException('ADMIN을 찾을 수 없습니다.');
      await tx.admin.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return true;
    });
  }

  /**
   * 관리자 차단 상태를 토글합니다.
   * @param id
   */
  async toggleBlock(id: string) {
    const admin = await this.findById(id);

    if (!admin) {
      throw new NotFoundException('관리자를 찾을 수 없습니다.');
    }

    await this.prisma.admin.update({
      where: { id },
      data: {
        status: admin.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
      },
    });

    return this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.admin.update({ where: { id }, data: { refreshToken } });
  }
}

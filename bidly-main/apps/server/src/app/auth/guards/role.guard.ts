import { AccessTokenPayload, RefreshTokenPayload, UserRole } from '@common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUtil } from '../auth.util';
import { ROLES_KEY } from '../decorators/auth.decorator';
import { AdminRole, Prisma } from '@prisma/client';

type AdminWithBlockedLogs = Prisma.AdminGetPayload<{
  include: {
    blockedLogs: true;
  };
}>;

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    private readonly authUtil: AuthUtil,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      (typeof AdminRole)[keyof typeof AdminRole][]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.authUtil.extractAccessTokenFromHeader(request);
    const cleanedAccessToken = accessToken?.replace(/"/g, '');
    const payload =
      this.authUtil.verifyToken<AccessTokenPayload>(cleanedAccessToken);

    if (payload) {
      const user = await this.getUserByPayload(payload);

      if (!user) {
        throw new UnauthorizedException('로그인이 필요합니다.');
      }

      if (payload.role === 'SUPER_ADMIN') {
        if ((user as AdminWithBlockedLogs).blockedLogs?.length) {
          throw new HttpException('차단된 계정입니다.', 497);
        }
        request['admin'] = user;
      } else {
        request['user'] = user;
      }

      return true;
    }

    throw new UnauthorizedException('접근 권한이 없습니다.');
  }

  private async getUserByPayload(
    payload: AccessTokenPayload | RefreshTokenPayload,
  ) {
    if (!payload) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    const { role, id } = payload;

    if (role === 'SUPER_ADMIN') {
      return await this.prisma.admin.findUnique({
        where: { id },
        include: {
          blockedLogs: {
            orderBy: { createdAt: Prisma.SortOrder.desc },
            take: 1,
            where: {
              until: {
                gte: new Date(),
              },
              userId: id, // 차단 대상
            },
          },
        },
      });
    } else {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    }
  }
}

import { AccessTokenPayload, RefreshTokenPayload } from '@common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUtil } from '../auth.util';

type AdminWithBlockedLogs = Prisma.AdminGetPayload<{
  include: {
    blockedLogs: true;
  };
}>;

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly authUtil: AuthUtil,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.authUtil.extractAccessTokenFromHeader(request);
    const cleanedAccessToken = accessToken?.replace(/"/g, '');

    const payload =
      this.authUtil.verifyToken<AccessTokenPayload>(cleanedAccessToken);

    if (!cleanedAccessToken) {
      this.logger.debug('⛔ Access Token을 찾을 수 없습니다.');
      throw new HttpException('사용자 정보를 찾을 수 없습니다.', 498);
    }

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

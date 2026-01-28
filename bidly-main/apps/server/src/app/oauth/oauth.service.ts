import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUtil } from '../auth/auth.util';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
import { UserDTO } from '../user/dtos/user.dto';
import { OAuthConnectDTO } from './dtos/oauth-connect.dto';
import { OauthCreateDTO } from './dtos/oauth.create.dto';

@Injectable()
export class OauthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtil: AuthUtil,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 리프레시 토큰을 저장합니다.
   * @param id 사용자 ID
   * @param refreshToken 리프레시 토큰
   * @returns {Promise<User>} 사용자 정보
   */
  async setRefreshToken(id: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  /**
   * 소셜 로그인 시, 회원 가입에 필요한 데이터가 부족한 경우, 회원가입을 진행합니다.
   * @param {CreateOAuthUserDTO} data 소셜 로그인 데이터
   * @returns {Promise<User>} 사용자 정보
   */
  async signUp(data: CreateUserDTO): Promise<User> {
    const { oAuth, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          email: oAuth.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('이미 가입된 회원입니다.');
      }

      const newUser = await tx.user.create({
        data: {
          ...rest,
          contact: data.contact,
          email: oAuth.email,
          auths: {
            create: {
              provider: oAuth.provider,
              email: oAuth.email,
              providerId: oAuth.providerId,
            },
          },
        },
      });

      await tx.auth.create({
        data: {
          provider: oAuth.provider,
          email: oAuth.email,
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      return newUser;
    });
  }

  /**
   * @name connect
   * @description connect SNS account to existing user
   * @param {OAuthConnectDTO} data
   * @param {User} user
   * @returns {Promise<boolean>}
   */
  async connect(data: OAuthConnectDTO, user: User): Promise<boolean> {
    let payload;
    if (data.token) {
      // 기존 이메일 회원이 SNS 계정을 연결할 때 토큰을 검증합니다.
      payload = this.authUtil.verifyToken<OauthCreateDTO>(data.token);
      if (!payload) throw new BadRequestException('토큰이 유효하지 않습니다.');
    }

    const {
      oAuth: { provider, email, providerId },
    } = data;

    return await this.prisma.$transaction(async (tx) => {
      await tx.auth.findUnique({
        select: {
          id: true,
        },
        where: {
          provider_email: {
            provider,
            email,
          },
        },
      });

      if (providerId) {
        const authCount = await tx.auth.count({
          where: {
            providerId,
          },
        });

        if (authCount)
          throw new BadRequestException('이미 사용중인 이메일입니다.');
      }

      await tx.auth.create({
        data: {
          providerId,
          provider,
          email: email,
          password: null,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return true;
    });
  }

  /**
   * Oauth 계정 연동을 해제합니다.
   * @param {UserDTO} user 사용자 정보
   * @param {string} id Oauth ID
   * @returns {Promise<User>} 사용자 정보
   */
  async disconnect(user: UserDTO, id: string): Promise<User> {
    const auth = await this.prisma.auth.findUnique({ where: { id } });

    if (!auth) {
      throw new NotFoundException('연동된 계정을 찾을 수 없습니다.');
    }

    if (auth.userId !== user.id) {
      throw new BadRequestException('해당 계정에 접근할 수 없습니다.');
    }

    await this.prisma.auth.delete({
      where: { id },
    });

    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: { auths: true },
    });
  }
}

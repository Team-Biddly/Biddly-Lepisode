import { UserLoginState } from '@common';
import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthProvider, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserDTO } from '../../user/dtos/user.dto';
import { OauthCreateDTO } from '../dtos/oauth.create.dto';
import { KAKAO_AUTH_MODULE_CONFIG } from './kakao.module.const';
import { KakaoAuthModuleConfig } from './kakao.module.type';
import { KakaoAccountResponse, KakaoTokenResponse } from './kakao.type';

@Injectable()
export class KakaoService {
  private readonly logger = new Logger(KakaoService.name);

  private readonly tokenEndpoint = 'https://kauth.kakao.com/oauth/token';
  private readonly accountEndpoint = 'https://kapi.kakao.com/v2/user/me';

  clientId = this.config.clientId;
  redirectUri = this.config.redirectUri;

  constructor(
    @Inject(KAKAO_AUTH_MODULE_CONFIG)
    private readonly config: KakaoAuthModuleConfig,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 인가코드를 이용해 토큰을 발급 받습니다.
   * @param {string} code
   * @returns {Promise<KakaoTokenResponse>}
   * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getToken(code: string): Promise<KakaoTokenResponse> {
    try {
      const { data } = await this.httpService.axiosRef.post<KakaoTokenResponse>(
        this.tokenEndpoint,
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        },
        {
          headers: {
            'Content-Type': ' application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      return data;
    } catch (error) {
      // console.dir(error, { depth: null });
      this.logger.error('카카오 토큰 발급 중 오류가 발생했습니다.', error);

      throw new BadGatewayException(
        '카카오 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도 해 주세요.',
      );
    }
  }

  /**
   * 엑세스 토큰을 이용해 계정 정보를 조회합니다.
   * @param {string} accessToken
   * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getAccount(accessToken: string): Promise<KakaoAccountResponse> {
    try {
      const { data } =
        await this.httpService.axiosRef.get<KakaoAccountResponse>(
          this.accountEndpoint,
          {
            params: {
              secure_resource: true,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

      if (!data.kakao_account.email) {
        this.logger.warn(
          '카카오 계정 정보 조회 중 이메일이 없습니다. 이메일 필수 동의가 필요합니다.',
        );
      }

      return data;
    } catch (error) {
      this.logger.error('카카오 계정 정보 조회 중 오류가 발생했습니다.', error);
      throw new BadGatewayException(
        '카카오 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도 해 주세요.',
      );
    }
  }

  /**
   * 카카오 소셜 로그인 시, 사용자의 소셜 로그인 상태를 확인합니다.
   * @param {OauthCreateDTO} data 소셜 로그인 데이터
   * @returns {Promise<keyof typeof UserLoginState>} 소셜 로그인 상태
   */
  async checkKakaoAuth(
    data: OauthCreateDTO,
  ): Promise<keyof typeof UserLoginState> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        provider_email: {
          email: data.email,
          provider: AuthProvider.KAKAO,
        },
      },
      select: {
        user: {
          select: {
            // id: true,
            blockLogs: {
              orderBy: { createdAt: Prisma.SortOrder.desc },
              take: 1,
              where: {
                until: {
                  gte: new Date(),
                },
              },
            },
            withdrawnLogs: {
              orderBy: { createdAt: Prisma.SortOrder.desc },
              take: 1,
              where: {
                until: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    });

    if (auth) return UserLoginState.로그인성공;
    if (!auth) return UserLoginState.회원가입필요;
  }

  /**
   * 소셜 로그인한 사용자를 찾습니다.
   * @param email 사용자 이메일
   * @returns {Promise<User>} 사용자 정보
   */
  async findUserByOAuthId(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        auths: {
          some: {
            provider: AuthProvider.KAKAO,
            email,
          },
        },
      },
      include: {
        auths: {
          select: {
            provider: true,
            email: true,
          },
        },
        blockLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          where: {
            until: {
              gte: new Date(),
            },
          },
        },
        withdrawnLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          where: {
            until: {
              gte: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('소셜 로그인한 회원이 아닙니다.');
    }

    return user;
  }

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

  async connect(
    payload: OauthCreateDTO & {
      account: KakaoAccountResponse;
    },
    loggedIn: UserDTO,
  ): Promise<User> {
    const { account } = payload;

    const auth = await this.prisma.auth.findUnique({
      where: {
        provider_email: {
          email: account.kakao_account.email,
          provider: AuthProvider.KAKAO,
        },
      },
    });

    if (auth) {
      throw new BadRequestException('이미 연결된 계정입니다.');
    }

    await this.prisma.auth.create({
      data: {
        provider: AuthProvider.KAKAO,
        email: account.kakao_account.email,
        password: null,
        user: {
          connect: {
            id: loggedIn.id,
          },
        },
      },
    });

    const user = this.prisma.user.findUnique({
      where: {
        id: loggedIn.id,
      },
      include: {
        auths: {
          omit: {
            password: true,
            userId: true,
          },
        },
      },
    });

    return user;
  }
}

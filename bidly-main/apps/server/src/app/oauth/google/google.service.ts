import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthProvider, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { unescape } from 'querystring';
import { UserDTO } from '../../user/dtos/user.dto';
import { GOOGLE_AUTH_MODULE_CONFIG } from './google.module.const';
import { GoogleAuthModuleConfig } from './google.module.type';
import { GoogleAccountResponse, GoogleTokenResponse } from './google.type';
import { UserLoginState } from '@common';
import { OauthCreateDTO } from '../dtos/oauth.create.dto';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly tokenEndpoint = 'https://oauth2.googleapis.com/token';
  private readonly accountEndpoint =
    'https://www.googleapis.com/oauth2/v3/userinfo';

  clientId = this.config.clientId;
  clientSecret = this.config.clientSecret;
  redirectUri = this.config.redirectUri;

  constructor(
    @Inject(GOOGLE_AUTH_MODULE_CONFIG)
    private readonly config: GoogleAuthModuleConfig,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}
  /**
   * 인가코드를 이용해 토큰을 발급 받습니다.
   * @param {string} code
   * @returns {Promise<GoogleTokenResponse>}
   * @see https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getToken(code: string): Promise<GoogleTokenResponse> {
    try {
      const { data } =
        await this.httpService.axiosRef.post<GoogleTokenResponse>(
          this.tokenEndpoint,
          {
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            code: unescape(code),
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          },
        );
      return data;
    } catch (error) {
      console.dir(error, { depth: null });
      this.logger.error('구글 토큰 발급 중 오류가 발생했습니다.', error);
      throw new BadGatewayException(
        '구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도 해 주세요.',
      );
    }
  }
  /**
   * 엑세스 토큰을 이용해 계정 정보를 조회합니다.
   * @param {string} accessToken
   * @see https://developers.google.com/identity/protocols/oauth2/web-server#callinganapi
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async getAccount(accessToken: string): Promise<GoogleAccountResponse> {
    try {
      const { data } =
        await this.httpService.axiosRef.get<GoogleAccountResponse>(
          this.accountEndpoint,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      return data;
    } catch (error) {
      this.logger.error('구글 계정 정보 조회 중 오류가 발생했습니다.', error);
      throw new BadGatewayException(
        '구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도 해 주세요.',
      );
    }
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

  /**
   * 구글 소셜 로그인 시, 사용자의 소셜 로그인 상태를 확인합니다.
   * @param {OauthCreateDTO} data 소셜 로그인 데이터
   * @param {GoogleAccountResponse} account 구글 소셜 로그인 응답
   * @returns {Promise<keyof typeof UserLoginState>} 소셜 로그인 상태
   */
  async checkGoogleAuth(
    data: OauthCreateDTO,
    account: GoogleAccountResponse,
  ): Promise<keyof typeof UserLoginState> {
    const googleResponse = account as GoogleAccountResponse;

    const oauth = await this.prisma.auth.findUnique({
      // where: { id: googleResponse.sub, provider: data.provider },
      where: {
        provider_email: {
          provider: AuthProvider.GOOGLE,
          email: googleResponse.email,
        },
      },
    });

    if (oauth) {
      return UserLoginState.로그인성공;
    }

    if (!googleResponse.email) {
      return UserLoginState.회원가입필요;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        auths: {
          some: {
            email: googleResponse.email,
          },
        },
      },
      include: {
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
      return UserLoginState.회원가입필요;
    }
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
            provider: AuthProvider.GOOGLE,
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

  async connect(data: OauthCreateDTO, loggedIn: UserDTO): Promise<User> {
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
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const auth = await this.prisma.auth.findUnique({
      where: {
        provider_email: {
          provider: AuthProvider.GOOGLE,
          email: data.email,
        },
      },
      select: {
        id: true,
      },
    });

    if (auth) {
      throw new BadRequestException('이미 연결된 계정입니다.');
    }

    await this.prisma.auth.create({
      data: {
        provider: AuthProvider.GOOGLE,
        email: data.email,
        password: null,
        user: {
          connect: {
            id: loggedIn.id,
          },
        },
      },
    });

    return user;
  }
}

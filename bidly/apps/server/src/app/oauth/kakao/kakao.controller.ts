import {
  AccessTokenPayload,
  RefreshTokenPayload,
  UserLoginState,
  UserRole,
} from '@common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthProvider } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Events } from '../../../libs';
import { TransformGroup } from '../../../libs/consts/class-transformer-groups.const';
import { AuthUtil } from '../../auth/auth.util';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserDTO } from '../../user/dtos/user.dto';
import { OAuthConnectDTO } from '../dtos/oauth-connect.dto';
import { OAuthResponseDTO } from '../dtos/oauth-response.dto';
import { KakaoService } from './kakao.service';
import { KakaoAccountResponse } from './kakao.type';
import { OauthCreateDTO } from '../dtos/oauth.create.dto';

@ApiTags('Kakao')
@Controller('oauth/kakao')
export class KakaoAuthController {
  constructor(
    private readonly authService: KakaoService,
    private readonly authUtil: AuthUtil,
    private readonly event: EventEmitter2,
  ) {}
  @Post('login')
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 수행합니다',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: '인가 코드',
  })
  @ApiOkResponse({
    type: OAuthResponseDTO,
  })
  async login(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OAuthResponseDTO> {
    const response = await this.authService.getToken(code);
    const account: KakaoAccountResponse = await this.authService.getAccount(
      response.access_token,
    );
    const state = await this.authService.checkKakaoAuth({
      provider: AuthProvider.KAKAO,
      email: account.kakao_account.email,
    });

    if (!response || !account || !state) {
      throw new BadRequestException('소셜 로그인에 실패했습니다.');
    }

    const signupToken = this.authUtil.createToken<OauthCreateDTO>(
      {
        email: account.kakao_account.email,
        provider: AuthProvider.KAKAO,
      },
      process.env.BASE_TOKEN_EXPIRES_IN,
    );
    if (state === UserLoginState.이미가입된계정) {
      return {
        state,
        token: signupToken,
      };
    }
    if (state === UserLoginState.회원가입필요) {
      return {
        state,
        token: signupToken,
        signUp: {
          email: account.kakao_account.email || '',
          provider: AuthProvider.KAKAO,
        },
      };
    }

    const user = await this.authService.findUserByOAuthId(
      account.kakao_account.email,
    );
    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: UserRole.USER,
      },
      process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
    );
    const refreshToken = this.authUtil.createToken<RefreshTokenPayload>(
      {
        id: user.id,
        role: UserRole.USER,
        isRefreshToken: true,
      },
      process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
    );
    await this.authService.setRefreshToken(user.id, refreshToken);
    res.header('Authorization', `Bearer ${accessToken}`);
    res.header('x-refresh-token', refreshToken);
    this.event.emit(Events.USER_LOGGED_IN, user);
    return {
      state,
      user: plainToInstance(UserDTO, user, {
        groups: [TransformGroup.ME],
      }),
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Post('connect')
  @ApiOperation({
    summary: '카카오 계정 연결',
    description: '기존 계정에 소셜 계정을 연결합니다.',
  })
  @ApiBody({ type: OAuthConnectDTO })
  @ApiOkResponse({ type: UserDTO })
  @Auth()
  async connect(@GetUser() loggedIn: UserDTO, @Body() data: OAuthConnectDTO) {
    const payload = this.authUtil.verifyToken<
      OauthCreateDTO & { account: any }
    >(data.token);
    const user = await this.authService.connect(payload, loggedIn);
    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ME],
    });
  }
}

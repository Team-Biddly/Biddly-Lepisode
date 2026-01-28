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
  Post,
  Query,
  Res,
} from '@nestjs/common';
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
import { AuthUtil } from '../../auth/auth.util';
import { UserDTO } from '../../user/dtos/user.dto';
import { OAuthResponseDTO } from '../dtos/oauth-response.dto';
import { GoogleAuthService } from './google.service';
import { OAuthConnectDTO } from '../dtos/oauth-connect.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../../../libs';
import { TransformGroup } from '../../../libs/consts/class-transformer-groups.const';
import { OauthCreateDTO } from '../dtos/oauth.create.dto';

@ApiTags('Google')
@Controller('oauth/google')
export class GoogleAuthController {
  constructor(
    private readonly authService: GoogleAuthService,
    private readonly authUtil: AuthUtil,
    private readonly event: EventEmitter2,
  ) {}
  @Post('signin')
  @ApiOperation({
    summary: '구글 로그인',
    description:
      '구글 로그인을 수행합니다. 로그인에 성공하면, 엑세스, 리프레쉬 토큰은 응답 헤더에 포함됩니다.',
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
    const account = await this.authService.getAccount(response.access_token);
    const state = await this.authService.checkGoogleAuth(
      {
        provider: AuthProvider.GOOGLE,
        email: account.email,
      },
      account,
    );
    if (!response || !account || !state) {
      throw new BadRequestException('소셜 로그인에 실패했습니다.');
    }
    const signupToken = this.authUtil.createToken<OauthCreateDTO>(
      {
        provider: AuthProvider.GOOGLE,
        email: account.email,
      },
      '30m',
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
          provider: AuthProvider.GOOGLE,
          email: account.email || '',
        },
      };
    }
    const user = await this.authService.findUserByOAuthId(account.email);
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
    summary: '구글 계정 연결',
    description: '기존에 가입된 계정이 있는 경우 소셜 계정을 연결합니다.',
  })
  @ApiBody({ type: OAuthConnectDTO })
  @ApiOkResponse({ type: UserDTO })
  @Auth()
  async connect(@GetUser() loggedIn: UserDTO, @Body() data: OAuthConnectDTO) {
    this.authUtil.verifyToken<OauthCreateDTO>(data.token);
    const user = await this.authService.connect(
      data.oAuth as OauthCreateDTO,
      loggedIn,
    );
    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ME],
    });
  }
}

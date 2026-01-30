import { AccessTokenPayload, RefreshTokenPayload, UserRole } from '@common';
import { Body, Controller, Param, Post, Query, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { AuthUtil } from '../auth/auth.util';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDTO } from '../user/dtos/user.dto';

import { OauthService } from './oauth.service';
import { TransformGroup } from '../../libs/consts/class-transformer-groups.const';
import { OAuthConnectDTO } from './dtos/oauth-connect.dto';
import { User } from '@prisma/client';
import { OauthCreateDTO } from './dtos/oauth.create.dto';
import { CreateUserDTO } from '../user/dtos/create-user.dto';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly authUtil: AuthUtil,
  ) {}

  @Post('connect')
  @Auth(UserRole.USER)
  @ApiOperation({
    summary: '기존 회원 SNS 계정 연결',
  })
  @ApiBody({ type: OAuthConnectDTO })
  @ApiOkResponse({ type: Boolean })
  async connect(
    @Body() data: OAuthConnectDTO,
    @GetUser() user: User,
  ): Promise<boolean> {
    return await this.oauthService.connect(data, user);
  }

  @Post('signup')
  @ApiOperation({
    summary: '소셜 회원가입',
    description: '소셜 회원가입을 진행합니다.',
  })
  @ApiQuery({ name: 'token', required: true, description: '토큰' })
  @ApiBody({ type: CreateUserDTO })
  @ApiOkResponse({ type: UserDTO })
  async signUp(
    @Query('token') token: string,
    @Body() data: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDTO> {
    const verify = this.authUtil.verifyToken<OauthCreateDTO>(token);
    const user = await this.oauthService.signUp(data);
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
    await this.oauthService.setRefreshToken(user.id, refreshToken);
    res.header('Authorization', `Bearer ${accessToken}`);
    res.header('x-refresh-token', refreshToken);
    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ME],
    });
  }
  @Post(':id/disconnect')
  @ApiOperation({
    summary: '소셜 계정 연결 해제',
    description: '소셜 계정을 연결 해제합니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Auth ID',
  })
  @ApiOkResponse({ type: UserDTO })
  @Auth()
  async disconnect(
    @GetUser() loggedIn: UserDTO,
    @Param('id') id: string,
  ): Promise<UserDTO> {
    const user = await this.oauthService.disconnect(loggedIn, id);
    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ME],
    });
  }
}

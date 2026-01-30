import { AccessTokenPayload, RefreshTokenPayload, UserRole } from '@common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Admin, Prisma, User, UserAccountStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { randomInt } from 'crypto';
import { Request } from 'express';
import { ApiOffsetPagination, EmailPipe, Events, TokenDTO } from '../../libs';
import { TransformGroup } from '../../libs/consts/class-transformer-groups.const';
import { AuthUtil } from '../auth/auth.util';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetAdmin } from '../auth/decorators/get-admin.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { EmailService } from '../email/email.service';
import { OauthCreateDTO } from '../oauth/dtos/oauth.create.dto';
import { SmsService } from '../sms/sms.service';
import {
  ContactValidationDTO,
  VerifyContactDTO,
} from './dtos/contact-validation.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { DeleteManyUserDTO } from './dtos/delete-many-user.dto';
import {
  EmailValidationDTO,
  VerifyEmailDTO,
} from './dtos/email-validation.dto';
import { FindEmailResponseDTO } from './dtos/find-email.dto';
import { SearchUserDTO } from './dtos/search-user.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import {
  UpdateContactDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { WithdrawUserDTO } from './dtos/withdraw-user.dto';
import { UserService } from './user.service';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly authUtil: AuthUtil,
  ) {}

  @Get('check/email')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복을 확인합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '이메일 중복 여부',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: '이메일',
    required: true,
    example: 'help@lepisode.team',
  })
  async checkEmail(
    @Query('email', new EmailPipe()) email: string,
  ): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }

  @Get('check/contact')
  @ApiOperation({
    summary: '연락처 중복 확인',
    description: '연락처 중복을 확인합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '연락처 중복 여부',
  })
  @ApiQuery({
    name: 'contact',
    type: String,
    description: '연락처',
    required: true,
    example: '01012345678',
  })
  async checkContact(@Query('contact') contact: string): Promise<boolean> {
    const user = await this.userService.findByContact(contact);
    return !!user;
  }

  @Get('me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '내 정보를 조회합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
    description: '내 정보',
  })
  @Auth()
  async getMe(@GetUser() user: User): Promise<UserDTO> {
    if (!user) return;
    return await this.userService.getMe(user.id);
  }

  @Get('search')
  @ApiOperation({ summary: '사용자 검색', description: '사용자를 검색합니다.' })
  @ApiOffsetPagination(UserDTO)
  async search(@Query() option: SearchUserDTO) {
    return await this.userService.search(option);
  }

  @Get('connect/contact')
  @ApiOperation({
    summary: '연락처 인증 후 계정 연결을 위해 연락처로 accessToken 발급',
  })
  @ApiQuery({
    name: 'contact',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TokenDTO,
    description: 'accessToken',
  })
  async getAccessTokenByContact(
    @Query('contact') contact: string,
  ): Promise<TokenDTO> {
    return await this.userService.getAccessTokenByContact(contact);
  }

  @Get('connect/email')
  @ApiOperation({
    summary: '이메일 인증 후 계정 연결을 위해 이메일로 accessToken 발급',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TokenDTO,
    description: 'accessToken',
  })
  async getAccessTokenByEmail(
    @Query('email') email: string,
  ): Promise<TokenDTO> {
    return await this.userService.getAccessTokenByEmail(email);
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 ID 기반 조회',
    description: '사용자를 ID 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
    description: '사용자 정보',
  })
  @Auth()
  async findById(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.findById(id);

    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ADMIN],
    });
  }

  @Post('find/email')
  @ApiOperation({
    summary: '이메일 찾기',
    description:
      '사용자 연락처와 이름를 기반으로 해당 회원의 모든 이메일을 찾습니다.',
  })
  @ApiOkResponse({
    type: FindEmailResponseDTO,
    description: '이메일 정보',
    isArray: true,
  })
  @ApiBody({
    type: ContactValidationDTO,
  })
  async findEmail(
    @Body() data: ContactValidationDTO,
  ): Promise<FindEmailResponseDTO[]> {
    const user = await this.userService.findByContactAndName(data);

    if (!user) {
      throw new NotFoundException('해당 정보로 가입된 회원이 없습니다.');
    }

    return user.auths.map((auth) => ({
      email: auth.email,
      createdAt: auth.createdAt,
      provider: auth.provider,
    }));
  }

  @Post('find/password')
  @ApiOperation({
    summary: '비밀번호 재설정 인증 이메일 발송',
    description: '비밀번호 재설정 이메일을 발송합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '이메일 발송 여부',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: '이메일',
    required: true,
    example: 'help@lepisode.team',
  })
  async sendPasswordResetEmail(
    @Query('email', new EmailPipe()) email: string,
  ): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('해당 이메일로 가입된 회원이 없습니다.');
    }

    await this.emailService.send({
      title: `[${process.env.SERVICE_NAME}] 비밀번호 재설정 안내`,
      body: '<h1>비밀번호 재설정</h1>',
      receiver: email,
    });

    return true;
  }

  @Post('signin')
  @ApiOperation({
    summary: 'email 사용자 로그인',
  })
  @ApiBody({
    type: SignInDTO,
  })
  @ApiOkResponse({
    type: TokenDTO,
  })
  async signinWithEmail(@Body() data: SignInDTO) {
    const user = await this.userService.signinWithEmail(data);

    // this.eventEmitter.emit(Events.USER_LOGGED_IN, user);

    return user;
  }

  @Post('signup')
  @ApiOperation({
    summary: '회원 가입',
    description: '회원으로 가입합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
    description: '생성된 회원 정보',
  })
  async create(@Body() data: CreateUserDTO): Promise<UserDTO> {
    const user = await this.userService.create(data);

    this.eventEmitter.emit(Events.USER_CREATED, {
      userId: user.id,
    });

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: 'USER',
      },
      process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
    );

    const userDto = plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ME],
    });

    return {
      ...userDto,
      accessToken,
    } as any;
  }

  @Post('sns')
  @ApiOperation({
    summary: '최초 SNS 회원 가입',
  })
  @ApiQuery({ name: 'token', required: true, description: '토큰' })
  @ApiBody({ type: CreateUserDTO })
  @ApiOkResponse({ type: UserDTO })
  async signUpWithSNS(
    @Query('token') token: string,
    @Body() data: CreateUserDTO,
  ): Promise<UserDTO> {
    return await this.userService.signUpWithSNS(data, token);
  }

  @Post('sns/signin')
  @ApiOperation({
    summary: 'SNS 계정 로그인',
  })
  @ApiBody({ type: OauthCreateDTO })
  @ApiOkResponse({ type: UserDTO })
  async signinWithSNS(@Body() data: OauthCreateDTO): Promise<UserDTO> {
    return await this.userService.signinWithSNS(data);
  }

  @Post('refresh')
  @ApiOperation({
    summary: '엑세스 토큰 갱신',
    description: '엑세스 토큰을 갱신합니다.',
  })
  @ApiOkResponse({
    description: '갱신된 엑세스 토큰',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiSecurity('x-refresh-token')
  async refresh(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken = this.authUtil.extractRefreshTokenFromHeader(req);

    if (!refreshToken) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    const payload =
      this.authUtil.verifyToken<RefreshTokenPayload>(refreshToken);

    const user = await this.userService.findById(payload.id);

    if (user.refreshToken && user.refreshToken !== refreshToken) {
      throw new BadRequestException(
        '요청이 만료되었습니다. 다시 로그인해주세요.',
      );
    }

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
        role: 'USER',
      },
      process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
    );

    return {
      accessToken,
    };
  }

  @Post('signout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '로그아웃 여부',
  })
  @Auth()
  async logout(@GetUser() user: UserDTO): Promise<boolean> {
    const updated = await this.userService.setRefreshToken(user.id, null);

    return updated.refreshToken === null;
  }

  @Post('code')
  @ApiBody({
    type: ContactValidationDTO,
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: '연락처 인증 코드 발송',
    description:
      '연락처로 인증을 요청합니다. 이름과 함께 요청하는 경우, 계정과 이름이 일치하는지 확인합니다.',
  })
  async sendCode(@Body() data: ContactValidationDTO) {
    const code = randomInt(100000, 999999).toString();

    if (data.name) {
      const user = await this.userService.findByContactAndName(data);

      if (!user) {
        throw new BadRequestException(
          '입력하신 정보와 일치하는 사용자가 없습니다.',
        );
      }
    }

    await this.smsService.send({
      body: `[${process.env.SERVICE_NAME}] 인증번호는 [${code}]입니다.`,
      receiver: data.contact,
    });

    const token = this.authUtil.createToken(
      {
        contact: data.contact,
        code,
      },
      '3m',
    );

    return {
      token,
    };
  }

  @Post('code/verify')
  @ApiBody({
    type: VerifyContactDTO,
  })
  @ApiOkResponse({
    type: Boolean,
    description: '인증 여부',
  })
  @ApiOperation({
    summary: '연락처 인증 코드 확인',
    description: '연락처로 전송된 인증 코드를 확인합니다',
  })
  async verifyCode(@Body() data: VerifyContactDTO): Promise<boolean> {
    const payload = this.authUtil.verifyToken<{
      contact: string;
      code: string;
    }>(data.token);

    return ['contact', 'code'].every((key) => {
      return payload[key] === data[key];
    });
  }

  @Post('email')
  @ApiBody({
    type: EmailValidationDTO,
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: '이메일 인증 코드 발송',
    description:
      '이메일로 인증 코드를 발송합니다. 이름과 함께 요청하는 경우, 계정과 이름이 일치하는지 확인합니다.',
  })
  async sendEmailCode(
    @Body() data: EmailValidationDTO,
  ): Promise<{ token: string }> {
    if (data?.name) {
      const user = await this.userService.findByEmailAndName(data);

      if (!user) {
        throw new BadRequestException(
          '입력하신 정보와 일치하는 사용자가 없습니다.',
        );
      }
    }

    return await this.userService.sendEmail(data);
  }

  @Post('email/verify')
  @ApiBody({
    type: VerifyEmailDTO,
  })
  @ApiOkResponse({
    type: Boolean,
    description: '인증 여부',
  })
  @ApiOperation({
    summary: '이메일 인증 코드 확인',
    description: '이메일로 전송된 인증 코드를 확인합니다.',
  })
  async verifyEmailCode(@Body() data: VerifyEmailDTO): Promise<boolean> {
    const payload = this.authUtil.verifyToken<{
      email: string;
      code: string;
    }>(data.token);

    return ['email', 'code'].every((key) => {
      return payload[key] === data[key];
    });
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: '토큰 기반 비밀번호 재설정',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async resetPassword(@Body() data: UpdatePasswordDTO): Promise<boolean> {
    return await this.userService.resetPassword(data);
  }

  @Patch('password')
  @Auth(UserRole.USER)
  @ApiOperation({
    summary: '비밀번호 변경',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async updatePassword(
    @GetUser() user: User,
    @Body() data: UpdatePasswordDTO,
  ): Promise<boolean> {
    return await this.userService.updatePassword(user.id, data);
  }

  @Patch('contact')
  @ApiOperation({
    summary: '연락처 변경',
    description: '연락처를 변경합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '연락처 변경 여부',
  })
  @Auth()
  async updateContact(
    @GetUser() user: UserDTO,
    @Body() data: UpdateContactDTO,
  ): Promise<boolean> {
    const updated = await this.userService.updateContact(user.id, data.contact);

    return updated.contact === data.contact;
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: '회원 상태 변경',
    description: '회원의 상태를 활성화 또는 차단으로 변경합니다.',
  })
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async toggleBlock(@Param('id') id: string, @GetAdmin() admin: Admin) {
    const updated = await this.userService.toggleBlock(id);

    if (updated.status === UserAccountStatus.BLOCKED) {
      this.eventEmitter.emit(Events.USER_BLOCKED, {
        userId: id,
        adminId: admin.id,
      });
    }

    if (updated.status === UserAccountStatus.ACTIVE) {
      this.eventEmitter.emit(Events.USER_UNBLOCKED, {
        userId: id,
        adminId: admin.id,
      });
    }

    return updated;
  }

  @Patch()
  @Auth()
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
    description: '수정된 사용자 정보',
  })
  async update(
    @GetUser() user: UserDTO,
    @Body() data: UpdateUserDTO,
  ): Promise<UserDTO> {
    const updated = await this.userService.update(user.id, data);
    return plainToInstance(UserDTO, updated);
  }

  @Patch('withdraw')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원을 탈퇴 대기 상태(재가입 가능)로 변경합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '회원 탈퇴 여부',
  })
  @Auth()
  async withdraw(@GetUser() user: UserDTO, @Body() data: WithdrawUserDTO) {
    const updated = await this.userService.withdraw(user.id, data);

    if (updated.status === UserAccountStatus.WITHDRAWN) {
      this.eventEmitter.emit(Events.USER_WITHDRAWN, {
        userId: user.id,
      });
    }
  }

  @Patch('unwithdraw')
  @ApiOperation({
    summary: '회원 탈퇴 취소',
    description: '회원 탈퇴를 취소합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '회원 탈퇴 취소 여부',
  })
  @Auth()
  async unwithdraw(@GetUser() user: UserDTO): Promise<boolean> {
    const updated = await this.userService.unwithdraw(user.id);

    return updated.withdrawnLogs[0].until === null;
  }

  @Patch(':id/block')
  @ApiOperation({
    summary: '사용자 차단',
    description: '사용자를 차단합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '사용자 차단 여부',
  })
  async block(
    @Param('id') id: string,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    const updated = await this.userService.block(id);

    return updated.blockLogs[0].until !== null;
  }

  @Patch(':id/unblock')
  @ApiOperation({
    summary: '사용자 차단 해제',
    description: '사용자의 차단을 해제합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '사용자 차단 해제 여부',
  })
  @Auth()
  async unblock(@Param('id') id: string): Promise<boolean> {
    const updated = await this.userService.unblocked(id);

    return updated.blockLogs[0].until === null;
  }

  @Delete()
  @ApiOperation({
    summary: '사용자 다중 삭제',
    description: '여러 사용자를 삭제합니다.',
  })
  @ApiOkResponse({
    description: '삭제된 사용자 수',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
        },
      },
    },
  })
  @Auth()
  async deleteMany(
    @Body() data: DeleteManyUserDTO,
  ): Promise<Prisma.BatchPayload> {
    const count = await this.userService.deleteMany(data);

    this.eventEmitter.emit(Events.USER_DELETED_MANY, data);

    return count;
  }

  @Delete(':id')
  @ApiOperation({
    summary: '사용자 삭제',
    description: '사용자를 삭제합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
    description: '삭제된 사용자 정보',
  })
  @Auth()
  async delete(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.delete(id);

    this.eventEmitter.emit(Events.USER_DELETED, user);

    return plainToInstance(UserDTO, user, {
      groups: [TransformGroup.ADMIN],
    });
  }
}

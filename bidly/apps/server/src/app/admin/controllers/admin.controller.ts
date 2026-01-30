import { UserRole } from '@common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Admin, AdminAccountStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Events, OffsetSearchOptionDTO } from '../../../libs';
import { AuthUtil } from '../../auth/auth.util';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetAdmin } from '../../auth/decorators/get-admin.decorator';
import { AdminSearchResponseDTO } from '../dtos/admin-search-response.dto';
import { AdminDTO } from '../dtos/admin.dto';
import { CreateAdminDTO } from '../dtos/create-admin.dto';
import { SignInAdminDTO } from '../dtos/sign-in-admin.dto';
import { UpdateAdminDTO } from '../dtos/update-admin.dto';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authUtil: AuthUtil,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('me')
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '내 정보 조회',
    description: '내 정보를 조회합니다.',
  })
  @ApiOkResponse({
    type: AdminDTO,
    description: '내 정보',
  })
  async getMe(@GetAdmin() data: AdminDTO): Promise<AdminDTO> {
    const user = await this.adminService.findById(data.id);

    return plainToInstance(AdminDTO, user);
  }

  @Get('search/offset')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: '관리자 오프셋 기반 조회',
  })
  @ApiOkResponse({
    type: AdminSearchResponseDTO,
    description: '관리자 목록',
  })
  async searchOffset(
    @Query() option: OffsetSearchOptionDTO,
  ): Promise<AdminSearchResponseDTO> {
    return await this.adminService.searchOffset(option);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOperation({
    summary: 'ADMIN 상세 조회',
  })
  @ApiOkResponse({ type: AdminDTO })
  async findById(@Param('id') id: string) {
    return await this.adminService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: '관리자 생성',
    description: '새로운 관리자를 생성합니다.',
  })
  @Auth(UserRole.SUPER_ADMIN)
  @ApiBody({ type: CreateAdminDTO })
  @ApiOkResponse({ type: Boolean, description: '관리자 생성 성공 여부' })
  async create(@Body() data: CreateAdminDTO): Promise<boolean> {
    return await this.adminService.create(data);
  }

  @Post('signin')
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자가 로그인합니다.',
  })
  @ApiOkResponse({
    description: '로그인 성공',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  async signIn(
    @Body() data: SignInAdminDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.adminService.findByEmail(data.email);

    if (!admin) {
      throw new NotFoundException('관리자를 찾을 수 없습니다.111');
    }

    if (admin.blockedLogs?.length) {
      throw new HttpException('차단된 계정입니다.', 497);
    }

    if (!this.authUtil.compareHash(data.password, admin.password)) {
      throw new NotFoundException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.authUtil.createToken(
      { id: admin.id, role: UserRole.SUPER_ADMIN },
      process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
    );

    const refreshToken = this.authUtil.createToken(
      { id: admin.id, role: UserRole.SUPER_ADMIN, isRefreshToken: true },
      process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
    );

    await this.adminService.setRefreshToken(admin.id, refreshToken);

    res.header('Authorization', `Bearer ${accessToken}`);
    res.header('x-refresh-token', refreshToken);

    this.eventEmitter.emit(Events.ADMIN_LOGGED_IN, { adminId: admin.id });

    return { accessToken, refreshToken };
  }

  @Post('logout')
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '관리자 로그아웃',
    description: '관리자 로그아웃을 수행합니다.',
  })
  async logout(@GetAdmin() admin: Admin): Promise<boolean> {
    await this.adminService.updateRefreshToken(admin.id, null);
    return true;
  }

  @Patch('me')
  @Auth(UserRole.ADMIN || UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '내 정보 수정',
    description: '내 정보를 수정합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async updateMyInfo(
    @Body() body: UpdateAdminDTO,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    return await this.adminService.updateMyInfo(body, admin.id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: '관리자 수정',
    description: '관리자 정보를 수정합니다.',
  })
  @ApiBody({
    type: UpdateAdminDTO,
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAdminDTO,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    return await this.adminService.update(id, body, admin.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: 'ADMIN 삭제',
  })
  @ApiOkResponse({ type: Boolean })
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.adminService.delete(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: '관리자 상태 변경',
    description: '관리자의 상태를 활성화 또는 차단으로 변경합니다.',
  })
  @Auth(UserRole.SUPER_ADMIN)
  async toggleBlock(@Param('id') id: string, @GetAdmin() superAdmin: Admin) {
    const updated = await this.adminService.toggleBlock(id);

    if (updated.status === AdminAccountStatus.BLOCKED) {
      this.eventEmitter.emit(Events.ADMIN_BLOCKED, {
        adminId: id,
        superAdminId: superAdmin.id,
      });
    }

    if (updated.status === AdminAccountStatus.ACTIVE) {
      this.eventEmitter.emit(Events.ADMIN_UNBLOCKED, {
        adminId: id,
        superAdminId: superAdmin.id,
      });
    }
  }
}

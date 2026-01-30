import { UserRole } from '@common';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetAdmin } from '../auth/decorators/get-admin.decorator';
import { BusinessInfoService } from './business-info.service';
import { BusinessInfoDTO } from './dtos/business-info.dto';
import { CreateBusinessInfoDTO } from './dtos/create-business-info.dto';
import { UpdateBusinessInfoDTO } from './dtos/update-business-info.dto';

@ApiTags('business-info')
@Controller('business-info')
export class BusinessInfoController {
  constructor(private readonly businessInfoService: BusinessInfoService) {}

  @Get()
  @ApiOperation({
    summary: '사업자 정보 관리 조회',
  })
  @ApiOkResponse({ type: BusinessInfoDTO, schema: { nullable: true } })
  async getBusinessInfo() {
    return await this.businessInfoService.getBusinessInfo();
  }

  @Post()
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '사업자 정보 관리 생성',
  })
  @ApiBody({ type: CreateBusinessInfoDTO })
  @ApiOkResponse({ type: Boolean })
  async create(
    @Body() body: CreateBusinessInfoDTO,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    if (!admin) {
      throw new UnauthorizedException('관리자 인증 정보가 없습니다.');
    }
    return await this.businessInfoService.create(body, admin.id);
  }

  @Patch()
  @ApiOperation({
    summary: '사업자 정보 관리 수정',
  })
  @ApiBody({ type: UpdateBusinessInfoDTO })
  @ApiOkResponse({ type: Boolean })
  async update(
    @Body()
    body: UpdateBusinessInfoDTO,
  ): Promise<boolean> {
    return await this.businessInfoService.update(body);
  }
}

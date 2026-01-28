import { UserRole } from '@common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Admin } from '@prisma/client';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetAdmin } from '../../auth/decorators/get-admin.decorator';
import { PolicyCreateDTO } from '../dtos/policy.create.dto';
import { PolicyDTO } from '../dtos/policy.dto';
import { PolicyUpdateDTO } from '../dtos/policy.update.dto';
import { PolicyService } from '../services/policy.service';

@ApiTags('policy')
@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get(':title')
  @ApiOperation({
    summary: '약관 상세 조회',
  })
  @ApiResponse({
    description: '약관 상세 정보',
    type: PolicyDTO,
  })
  async findByTitle(@Param('title') title: string): Promise<PolicyDTO> {
    return await this.policyService.findByTitle(title);
  }

  @Post()
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '약관 등록',
  })
  @ApiResponse({
    type: Boolean,
  })
  async create(
    @Body() body: PolicyCreateDTO,
    @GetAdmin() user: Admin,
  ): Promise<boolean> {
    return await this.policyService.create(body, user);
  }

  @Patch(':id')
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '약관 수정',
  })
  @ApiResponse({
    type: Boolean,
  })
  async update(
    @Param('id') id: string,
    @Body() body: PolicyUpdateDTO,
    @GetAdmin() user: Admin,
  ): Promise<boolean> {
    return await this.policyService.update(id, body, user);
  }

  @Delete(':id')
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '약관 삭제',
  })
  @ApiResponse({
    type: Boolean,
  })
  async delete(
    @Param('id') id: string,
    @GetAdmin() user: Admin,
  ): Promise<boolean> {
    return await this.policyService.delete(id, user);
  }
}

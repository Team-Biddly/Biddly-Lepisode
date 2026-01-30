import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoleService } from './user-role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './dtos/create-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleDTO } from './dtos/role.dto';
import {
  CreateRoleLevelPermissionDTO,
  UpdateRoleLevelPermissionDTO,
} from './dtos/create-permission.dto';

@ApiTags('User Role')
@Controller({ path: 'user-role' })
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  @ApiOperation({ summary: '역할 조회' })
  @ApiOkResponse({ type: RoleDTO, isArray: true })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: '검색어',
  })
  async findAll(@Query('query') query: string) {
    const res = await this.userRoleService.findAll(query);
    return res.map((role) => plainToInstance(RoleDTO, role));
  }

  @Post()
  @ApiOperation({ summary: '역할 생성' })
  @ApiBody({
    type: CreateRoleDTO,
  })
  async createRole(@Body() body: CreateRoleDTO) {
    const res = await this.userRoleService.createRole(body);
    return plainToInstance(RoleDTO, res);
  }

  @Post('permission')
  @ApiOperation({ summary: '권한 생성' })
  @ApiBody({
    type: CreateRoleLevelPermissionDTO,
  })
  async createPermission(@Body() body: CreateRoleLevelPermissionDTO) {
    const res = await this.userRoleService.createPermission(body);
    return plainToInstance(RoleDTO, res);
  }

  @Patch(':id')
  @ApiOperation({ summary: '역할 수정' })
  @ApiBody({
    type: UpdateRoleDTO,
  })
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
    const res = await this.userRoleService.updateRole(id, body);
    return plainToInstance(RoleDTO, res);
  }

  @Patch('permission/:permissionId')
  @ApiOperation({ summary: '권한 수정' })
  @ApiBody({
    type: UpdateRoleLevelPermissionDTO,
  })
  async updatePermission(
    @Param('permissionId') permissionId: string,
    @Body() body: UpdateRoleLevelPermissionDTO,
  ) {
    const res = await this.userRoleService.updatePermission(permissionId, body);
    return plainToInstance(RoleDTO, res);
  }

  @Delete(':id')
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiOperation({ summary: '역할 삭제' })
  async deleteRole(@Param('id') id: string) {
    await this.userRoleService.deleteRole(id);
    return true;
  }

  @Delete('permission/:permissionId')
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiOperation({ summary: '권한 삭제' })
  async deletePermission(@Param('permissionId') permissionId: string) {
    await this.userRoleService.deletePermission(permissionId);
    return true;
  }
}

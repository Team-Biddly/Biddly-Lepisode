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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserManagementService } from './user-management.service';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../user/dtos/user.dto';
import {
  ApiCursorPagination,
  ApiOffsetPagination,
  CursorPaginationDTO,
  OffsetPaginationDTO,
} from '../../libs';

@ApiTags('UserManagement')
@Controller({ path: 'user-management', version: '1' })
export class UserManagementController {
  constructor(private readonly service: UserManagementService) {}

  @Get('search/offset')
  @ApiOperation({
    summary: '사용자 오프셋 기반 조회',
    description: '사용자를 오프셋 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: OffsetPaginationDTO<UserDTO>,
    description: '사용자 목록',
  })
  @ApiOffsetPagination(UserDTO)
  async searchOffset(@Query() option): Promise<OffsetPaginationDTO<UserDTO>> {
    const { items, pageInfo } = await this.service.searchOffset(option);

    return {
      items: plainToInstance(UserDTO, items),
      pageInfo,
    };
  }

  @Get('search/cursor')
  @ApiOperation({
    summary: '사용자 커서 기반 조회',
    description: '사용자를 커서 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: CursorPaginationDTO<UserDTO>,
    description: '사용자 목록',
  })
  @ApiCursorPagination(UserDTO)
  async searchCursor(@Query() option): Promise<CursorPaginationDTO<UserDTO>> {
    const { items, ...cursorInfo } = await this.service.searchCursor(option);

    return {
      items: plainToInstance(UserDTO, items),
      ...cursorInfo,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 상세 조회',
    description: '사용자 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
  })
  async findById(@Param('id') id: string) {
    const user = await this.service.findById(id);
    return plainToInstance(UserDTO, user);
  }

  @Post()
  @ApiOperation({
    summary: '사용자 생성',
    description: '관리자가 사용자를 생성합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
  })
  async create(@Body() body: CreateUserDTO) {
    const user = await this.service.create(body);
    return plainToInstance(UserDTO, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '사용자 수정',
    description: '관리자가 사용자를 수정합니다.',
  })
  @ApiOkResponse({
    type: UserDTO,
  })
  async update(@Body() body: CreateUserDTO, @Param('id') id: string) {
    const user = await this.service.update(id, body);
    return plainToInstance(UserDTO, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '사용자 삭제',
    description: '관리자가 사용자를 삭제합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return true;
  }
}

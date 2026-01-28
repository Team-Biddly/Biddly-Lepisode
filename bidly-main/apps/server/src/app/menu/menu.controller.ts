import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { MenuService } from './services/menu.service';
import { plainToInstance } from 'class-transformer';
import {
  MenuSearchOffsetOptionDTO,
  MenuCursorSearchOptionDTO,
} from './dtos/search-menu.dto';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { CursorPaginationDTO } from '../../libs/dtos/cursor-pagination.dto';
import { ApiOffsetPagination } from '../../libs/decorators/offset-pagination.decorator';
import { ApiCursorPagination } from '../../libs/decorators/cursor-pagination.decorator';
import { MenuDTO } from './dtos/menu.dto';
import { CreateMenuDTO } from './dtos/create-menu.dto';
import { UpdateMenuDTO } from './dtos/update-menu.dto';
import { MenuPermissionDTO } from './dtos/menu-permission.dto';
import { CreateMenuPermissionDTO } from './dtos/create-menu-permission.dto';
import { MenuPermissionService } from './services/menu-permission.service';
import { FindMenuDTO } from './dtos/find-menu.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly menuPermissionService: MenuPermissionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '메뉴 전체 조회',
    description: '메뉴 전체를 조회합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 목록 조회 성공',
    type: MenuDTO,
    isArray: true,
  })
  async findAll(@Query() option: FindMenuDTO) {
    const menus = await this.menuService.findAll(option);

    return plainToInstance(MenuDTO, menus);
  }

  @Get('search/offset')
  @ApiOperation({
    summary: '메뉴 오프셋 기반 조회',
    description: '메뉴을(를) 오프셋 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: OffsetPaginationDTO,
    description: '메뉴 목록 및 오프셋 페이징 정보',
  })
  @ApiOffsetPagination(MenuDTO)
  async searchOffset(
    @Query() option: MenuSearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO<MenuDTO>> {
    const { items, pageInfo } = await this.menuService.searchOffset(option);

    return {
      items: plainToInstance(MenuDTO, items),
      pageInfo,
    };
  }

  @Get('search/cursor')
  @ApiOperation({
    summary: '메뉴 커서 기반 조회',
    description: '메뉴을(를) 커서 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: CursorPaginationDTO,
    description: '메뉴 목록 및 커서 페이징 정보',
  })
  @ApiCursorPagination(MenuDTO)
  async searchCursor(
    @Query() option: MenuCursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO<MenuDTO>> {
    const { items, ...pageInfo } = await this.menuService.searchCursor(option);

    return {
      items: plainToInstance(MenuDTO, items),
      ...pageInfo,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '메뉴 ID 기반 조회',
    description: '메뉴을(를) ID를 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 조회 성공',
    type: MenuDTO,
  })
  async findById(@Param('id') id: string) {
    const menu = await this.menuService.findById(id);

    return plainToInstance(MenuDTO, menu);
  }

  @Post()
  @ApiOperation({
    summary: '메뉴 생성',
    description: '메뉴을(를) 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '메뉴 생성 성공',
    type: MenuDTO,
  })
  async create(@Body() data: CreateMenuDTO) {
    const menu = await this.menuService.create(data);

    return plainToInstance(MenuDTO, menu);
  }

  @Post('permission')
  @ApiOperation({
    summary: '메뉴 권한 생성',
    description: '메뉴 권한을(를) 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '메뉴 권한 생성 성공',
    type: MenuPermissionDTO,
  })
  async createPermission(
    @Query('menuId') menuId: string,
    @Body() data: CreateMenuPermissionDTO,
  ) {
    const menu = await this.menuPermissionService.create(menuId, data);
    return plainToInstance(MenuPermissionDTO, menu);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '메뉴 수정',
    description: '메뉴을(를) 수정합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 수정 성공',
    type: MenuDTO,
  })
  async update(@Param('id') id: string, @Body() data: UpdateMenuDTO) {
    const menu = await this.menuService.update(id, data);

    return plainToInstance(MenuDTO, menu);
  }

  @Patch('permission/:permissionId')
  @ApiOperation({
    summary: '메뉴 권한 수정',
    description: '메뉴 권한을(를) 수정합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 권한 수정 성공',
    type: MenuPermissionDTO,
  })
  async updatePermission(
    @Param('permissionId') permissionId: string,
    @Body() data: CreateMenuPermissionDTO,
  ) {
    const menu = await this.menuPermissionService.update(permissionId, data);
    return plainToInstance(MenuPermissionDTO, menu);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '메뉴 삭제',
    description: '메뉴을(를) 삭제합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 삭제 성공',
    type: MenuDTO,
  })
  async delete(@Param('id') id: string) {
    const menu = await this.menuService.delete(id);

    return plainToInstance(MenuDTO, menu);
  }

  @Delete('permission/:permissionId')
  @ApiOperation({
    summary: '메뉴 권한 삭제',
    description: '메뉴 권한을(를) 삭제합니다.',
  })
  @ApiOkResponse({
    description: '메뉴 권한 삭제 성공',
    type: MenuPermissionDTO,
  })
  async deletePermission(@Param('permissionId') permissionId: string) {
    const menu = await this.menuPermissionService.delete(permissionId);
    return plainToInstance(MenuPermissionDTO, menu);
  }
}

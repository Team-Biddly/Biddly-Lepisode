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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { BannerCreateDTO } from '../dtos/banner.create.dto';
import { BannerDTO } from '../dtos/banner.dto';
import { BannerReorderDTO } from '../dtos/banner.reorder.dto';
import { BannerSearchResponseDTO } from '../dtos/banner.search-response.dto';
import { BannerSearchDTO } from '../dtos/banner.search.dto';
import { BannerUpdateDTO } from '../dtos/banner.update.dto';
import { BannerService } from '../services/banner.service';
import { UserRole } from '@common';
import { Admin } from '@prisma/client';
import { GetAdmin } from '../../auth/decorators/get-admin.decorator';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @ApiOperation({ summary: '배너 목록 조회' })
  @ApiResponse({
    description: '배너 목록 조회 성공',
    type: BannerSearchResponseDTO,
  })
  async search(
    @Query() params: BannerSearchDTO,
  ): Promise<BannerSearchResponseDTO> {
    return await this.bannerService.search(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '배너 상세 조회' })
  @ApiResponse({
    description: '배너 상세 조회 성공',
    type: BannerDTO,
  })
  async findById(@Param('id') id: string) {
    return await this.bannerService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '배너 생성' })
  @ApiResponse({
    description: '배너 생성 성공',
    type: Boolean,
  })
  @Auth(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async create(@Body() body: BannerCreateDTO, @GetAdmin() admin: Admin) {
    return await this.bannerService.create(body, admin);
  }

  @Patch('reorder')
  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: '순서 변경',
  })
  @ApiBody({
    type: BannerReorderDTO,
  })
  @ApiOkResponse({ type: Boolean })
  async reorder(
    @Body() body: BannerReorderDTO,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    return await this.bannerService.reorder(body, admin);
  }

  @Patch(':id')
  @ApiOperation({ summary: '배너 수정' })
  @ApiResponse({
    description: '배너 수정 성공',
    type: Boolean,
  })
  @Auth(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: BannerUpdateDTO,
    @GetAdmin() admin: Admin,
  ) {
    return await this.bannerService.update(id, body, admin);
  }

  @Delete(':id')
  @ApiOperation({ summary: '배너 삭제' })
  @ApiResponse({
    description: '배너 삭제 성공',
    type: Boolean,
  })
  @Auth(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async delete(@Param('id') id: string) {
    return await this.bannerService.delete(id);
  }
}

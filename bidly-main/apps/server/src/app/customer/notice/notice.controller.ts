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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { NoticeDTO } from './dtos/notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dot';
import { NoticeService } from './notice.service';
import { SearchNoticeDTO } from './dtos/search-notice.dto';
import { OffsetPaginationDTO } from 'apps/server/src/libs';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserDTO } from '../../user/dtos/user.dto';

@ApiTags('Notice')
@Controller({ path: 'notice', version: '1' })
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Notice 검색',
  })
  @ApiOkResponse({ type: OffsetPaginationDTO<NoticeDTO> })
  async search(
    @Query() query: SearchNoticeDTO,
  ): Promise<OffsetPaginationDTO<NoticeDTO>> {
    return await this.noticeService.search(query);
  }

  @Get()
  @ApiOperation({
    summary: '모든 Notice 목록 조회',
  })
  @ApiOkResponse({ type: [NoticeDTO] })
  async findAll(): Promise<NoticeDTO[]> {
    return await this.noticeService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOperation({
    summary: 'Notice id로 조회',
  })
  @ApiOkResponse({ type: NoticeDTO })
  async findById(@Param('id') id: string) {
    return await this.noticeService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Notice 생성',
  })
  @ApiBody({ type: CreateNoticeDTO })
  @ApiCreatedResponse({ type: NoticeDTO })
  async create(
    @Body()
    body: CreateNoticeDTO,
    @GetUser() user: UserDTO,
  ): Promise<NoticeDTO> {
    return await this.noticeService.create(body, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Notice 수정',
  })
  @ApiBody({ type: UpdateNoticeDTO })
  @ApiOkResponse({ type: NoticeDTO })
  async update(
    @Param('id') id: string,
    @Body()
    body: UpdateNoticeDTO,
  ): Promise<NoticeDTO> {
    return await this.noticeService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Notice 삭제',
  })
  @ApiOkResponse({ type: Boolean })
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.noticeService.delete(id);
  }

  @Patch(':id/pin')
  @ApiOperation({
    summary: '공지사항 고정/고정해제',
  })
  @ApiOkResponse({ type: Boolean })
  async togglePinned(@Param('id') id: string): Promise<boolean> {
    return await this.noticeService.togglePinned(id);
  }
}

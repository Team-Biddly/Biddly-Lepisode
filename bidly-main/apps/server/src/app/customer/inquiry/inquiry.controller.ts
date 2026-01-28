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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@prisma/client';
import { OffsetPaginationDTO, OffsetSearchOptionDTO } from '../../../libs';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { CreateInquiryDTO } from './dtos/create-inquiry.dto';
import { InquiryDTO } from './dtos/inquiry.dto';
import { UpdateInquiryDTO } from './dtos/update-inquiry.dto';
import { InquiryService } from './inquiry.service';

@ApiTags('Inquiry')
@Controller({ path: 'inquiry', version: '1' })
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Get('search')
  @ApiOperation({
    summary: '1:1 문의 검색',
  })
  @ApiOkResponse({ type: OffsetPaginationDTO<InquiryDTO> })
  async search(
    @Query() query: OffsetSearchOptionDTO,
  ): Promise<OffsetPaginationDTO<InquiryDTO>> {
    return await this.inquiryService.search(query);
  }

  @Get()
  @ApiOperation({
    summary: '전체1:1 문의 목록 조회',
  })
  @ApiOkResponse({ type: InquiryDTO, isArray: true })
  async findAll(): Promise<InquiryDTO[]> {
    return await this.inquiryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '1:1 문의 상세 조회',
  })
  @ApiOkResponse({ type: InquiryDTO })
  async findById(@Param('id') id: string): Promise<InquiryDTO> {
    return await this.inquiryService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: '1:1 문의 등록',
  })
  @ApiOkResponse({ type: InquiryDTO })
  async create(
    @Body() body: CreateInquiryDTO,
    @GetUser() user: User,
  ): Promise<InquiryDTO> {
    return await this.inquiryService.create(body, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '1:1 문의 수정',
  })
  @ApiBody({ type: UpdateInquiryDTO })
  @ApiOkResponse({ type: InquiryDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateInquiryDTO,
    @GetUser() user?: User,
  ): Promise<InquiryDTO> {
    return await this.inquiryService.update(id, body, user.id);
  }

  @Patch(':id/answer')
  @ApiOperation({
    summary: '1:1 문의 답변 등록 및 수정',
  })
  @ApiBody({ type: UpdateInquiryDTO })
  @ApiOkResponse({ type: InquiryDTO })
  async answer(
    @Param('id') id: string,
    @Body() body: UpdateInquiryDTO,
    @GetUser() admin?: User,
  ): Promise<InquiryDTO> {
    return await this.inquiryService.answer(id, body, admin.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '1:1 문의 삭제',
  })
  @ApiOkResponse({ type: Boolean })
  async delete(
    @Param('id') id: string,
    @GetUser() admin?: User,
  ): Promise<boolean> {
    return await this.inquiryService.delete(id, admin?.id);
  }
}

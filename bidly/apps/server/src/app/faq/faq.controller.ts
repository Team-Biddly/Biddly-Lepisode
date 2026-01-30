import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
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
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '@common';
import { CreateFaqDTO } from './dtos/create-faq.dto';
import { GetAdmin } from '../auth/decorators/get-admin.decorator';
import { Admin } from '@prisma/client';
import { FaqSearchResponseDTO } from './dtos/faq-search-response.dto';
import { SearchFaqDTO } from './dtos/search-faq.dto';
import { FaqDTO } from './dtos/faq.dto';
import { UpdateFaqDTO } from './dtos/update-faq.dto';

@ApiTags('Faq')
@Controller({ path: 'faq', version: '1' })
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('search')
  @ApiOperation({
    summary: 'FAQ 검색',
  })
  @ApiOkResponse({ type: FaqSearchResponseDTO })
  async search(@Query() query: SearchFaqDTO): Promise<FaqSearchResponseDTO> {
    return await this.faqService.search(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOperation({
    summary: 'FAQ 상세 조회',
  })
  @ApiOkResponse({ type: FaqDTO })
  async findById(@Param('id') id: string) {
    return await this.faqService.findById(id);
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: 'FAQ 생성',
  })
  @ApiBody({ type: CreateFaqDTO })
  @ApiOkResponse({ type: Boolean })
  async create(
    @Body()
    body: CreateFaqDTO,
    @GetAdmin() admin: Admin,
  ): Promise<boolean> {
    return await this.faqService.create(body, admin.id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: 'FAQ 수정',
  })
  @ApiBody({ type: UpdateFaqDTO })
  @ApiOkResponse({ type: Boolean })
  async update(
    @Param('id') id: string,
    @Body()
    body: UpdateFaqDTO,
  ): Promise<boolean> {
    return await this.faqService.update(id, body);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: 'FAQ 삭제',
  })
  @ApiOkResponse({ type: Boolean })
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.faqService.delete(id);
  }

  @Patch(':id/pin')
  @Auth(UserRole.ADMIN)
  @ApiOperation({
    summary: 'FAQ 고정/고정해제',
  })
  @ApiOkResponse({ type: Boolean })
  async togglePinned(@Param('id') id: string): Promise<boolean> {
    return await this.faqService.togglePinned(id);
  }
}

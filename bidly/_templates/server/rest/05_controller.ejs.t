---
to: 'apps/server/src/app/<%= kebab %>/<%= kebab %>.controller.ts'
---
import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { <%= pascal %>Service } from './<%= kebab %>.service';
import { plainToInstance } from "class-transformer";
import { <%= pascal %>SearchOffsetOptionDTO, <%= pascal %>CursorSearchOptionDTO } from './dtos/search-<%= kebab %>.dto';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { CursorPaginationDTO } from '../../libs/dtos/cursor-pagination.dto';
import { ApiOffsetPagination } from '../../libs/decorators/offset-pagination.decorator';
import { ApiCursorPagination } from '../../libs/decorators/cursor-pagination.decorator';
import { <%= pascal %>DTO } from './dtos/<%= kebab %>.dto';
import { Create<%= pascal %>DTO } from './dtos/create-<%= kebab %>.dto';
import { Update<%= pascal %>DTO } from './dtos/update-<%= kebab %>.dto';

@ApiTags('<%= pascal %>')
@Controller('<%= kebab %>')
export class <%= pascal %>Controller {

  constructor(private readonly <%= camel %>Service: <%= pascal %>Service) {}

  @Get()
  @ApiOperation({
    summary: '<%= domain %> 전체 조회',
    description: '<%= domain %> 전체를 조회합니다.',
  })
  @ApiOkResponse({
    description: '<%= domain %> 목록 조회 성공',
    type: <%= pascal %>DTO,
    isArray: true,
  })
  async findAll() {
    const <%= h.inflection.pluralize(camel) %> = await this.<%= camel %>Service.findAll();

    return plainToInstance(<%= pascal %>DTO, <%= h.inflection.pluralize(camel) %>);
  }

  @Get("search/offset")
  @ApiOperation({
    summary: "<%= domain %> 오프셋 기반 조회",
    description: "<%= domain %>을(를) 오프셋 기반으로 조회합니다.",
  })
  @ApiOkResponse({
    type: OffsetPaginationDTO,
    description: "<%= domain %> 목록 및 오프셋 페이징 정보",
  })
  @ApiOffsetPagination(<%= pascal %>DTO)
  async searchOffset(
    @Query() option: <%= pascal %>SearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO> {
    const { items, pageInfo } = await this.<%= camel %>Service.searchOffset(option);
    
    return {
      items: plainToInstance(<%= pascal %>DTO, items),
      pageInfo,
    }
  }

  @Get("search/cursor")
  @ApiOperation({
    summary: "<%= domain %> 커서 기반 조회",
    description: "<%= domain %>을(를) 커서 기반으로 조회합니다.",
  })
  @ApiOkResponse({
    type: CursorPaginationDTO,
    description: "<%= domain %> 목록 및 커서 페이징 정보",
  })
  @ApiCursorPagination(<%= pascal %>DTO)
  async searchCursor(
    @Query() option: <%= pascal %>CursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO> {
    const { items, ...pageInfo } = await this.<%= camel %>Service.searchCursor(option);
    
    return {
      items: plainToInstance(<%= pascal %>DTO, items),
      ...pageInfo,
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: '<%= domain %> ID 기반 조회',
    description: '<%= domain %>을(를) ID를 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    description: '<%= domain %> 조회 성공',
    type: <%= pascal %>DTO,
  })
  async findById(
      @Param('id') id: string
  ) {
    const <%= camel %> = await this.<%= camel %>Service.findById(id);

    return plainToInstance(<%= pascal %>DTO, <%= camel %>);
  }

  @Post()
  @ApiOperation({
    summary: '<%= domain %> 생성',
    description: '<%= domain %>을(를) 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '<%= domain %> 생성 성공',
    type: <%= pascal %>DTO,
  })
  async create(@Body() data: Create<%= pascal %>DTO) {
    const <%= camel %> = await this.<%= camel %>Service.create(data);

    return plainToInstance(<%= pascal %>DTO, <%= camel %>);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '<%= domain %> 수정',
    description: '<%= domain %>을(를) 수정합니다.',
  })
  @ApiOkResponse({
    description: '<%= domain %> 수정 성공',
    type: <%= pascal %>DTO,
  })
  async update(
    @Param('id') id: string,
    @Body() data: Update<%= pascal %>DTO) {
    const <%= camel %> = await this.<%= camel %>Service.update(id, data);

    return plainToInstance(<%= pascal %>DTO, <%= camel %>);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '<%= domain %> 삭제',
    description: '<%= domain %>을(를) 삭제합니다.',
  })
  @ApiOkResponse({
    description: '<%= domain %> 삭제 성공',
    type: <%= pascal %>DTO,
  })
  async delete(@Param('id') id: string) {
    const <%= camel %> = await this.<%= camel %>Service.delete(id);

    return plainToInstance(<%= pascal %>DTO, <%= camel %>);
  }
}
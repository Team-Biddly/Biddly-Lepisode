---
to: 'apps/server/src/app/<%= kebab %>/<%= kebab %>.service.ts'
---
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Create<%= pascal %>DTO } from './dtos/create-<%= kebab %>.dto';
import { Update<%= pascal %>DTO } from './dtos/update-<%= kebab %>.dto';
import { Prisma, <%= pascal %> } from '@prisma/client';
import { CursorPaginationDTO } from "../../libs/dtos/cursor-pagination.dto";
import { OffsetPaginationDTO } from "../../libs/dtos/offset-pagination.dto";
import {
  <%= pascal %>SearchOffsetOptionDTO,
  <%= pascal %>CursorSearchOptionDTO,
} from "./dtos/search-<%= kebab %>.dto";

@Injectable()
export class <%= pascal %>Service {
    
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 전체 <%= domain %> 조회
   * @returns {Promise<<%= pascal %>[]>} <%= domain %> 정보
   */
  async findAll():Promise<<%= pascal %>[]> {
    const <%= h.inflection.pluralize(camel) %> = await this.prisma.<%= camel %>.findMany();

    return <%= h.inflection.pluralize(camel) %>;
  }

  /**
   * <%= domain %> 오프셋 기반 조회
   * @param {<%= pascal %>SearchOffsetOptionDTO} option <%= domain %> 검색 옵션
   * @returns {Promise<OffsetPaginationDTO>} <%= domain %> 정보
   */
  async searchOffset(
      option: <%= pascal %>SearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO> {
    const { pageNo, pageSize, query, orderBy, align } = option;

    const where: Prisma.<%= pascal %>WhereInput = {}; 

    // @todo: 쿼리 조건 추가
    if (query) {
    where.OR = [];
    }
    
    // @todo: AND 조건 추가
    where.AND = [];
    

    const items = await this.prisma.<%= camel %>.findMany({
      where,
      orderBy: { [orderBy || "createdAt"]: align || "desc" },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
      // include: {},  @todo 종속된 엔티티를 가져오는 경우 사용
    });

    const count = await this.prisma.<%= camel %>.count({ where });

    return {
      items,
      pageInfo: {
          pageNo: option.pageNo,
          pageSize: option.pageSize,
          totalPages: Math.ceil(count / option.pageSize),
          totalItems: count,
          pageItems: items.length,
      },
    };
  }


   /**
    * <%= domain %> 커서 기반 조회
    * @param {<%= pascal %>CursorSearchOptionDTO} option <%= domain %> 검색 옵션
    * @returns {Promise<CursorPaginationDTO>} <%= domain %> 정보
    */
  async searchCursor(
    option: <%= pascal %>CursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO> {
    const { cursor, pageSize, query, orderBy, align } = option;

    const where: Prisma.<%= pascal %>WhereInput = {}; // @todo: 검색 조건 추가

    // @todo: 쿼리 조건 추가
    if (query) {
      where.OR = [];
    }

    // @todo: AND 조건 추가
    where.AND = []; 

    const items = await this.prisma.<%= camel %>.findMany({
      where,
      orderBy: { [orderBy || "createdAt"]: align || "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
       // include: {},  @todo 종속된 엔티티를 가져오는 경우 사용
    });

    const hasNext = items.length > pageSize;

    const result = {
      items: items.slice(0, pageSize),
      nextCursor: undefined,
      hasNext,
    };

    if (hasNext) result.nextCursor = items.at(-1)?.id;

    return result;
  }

  /**
  * <%= domain %> ID 기반 조회
  * @param {string} id <%= domain %> ID
  * @returns {Promise<<%= pascal %>>} <%= domain %> 정보
  */
  async findById(id: string): Promise<<%= pascal%>> {
    const <%= camel %> = await this.prisma.<%= camel %>.findUnique({ where: { id } });

    return <%= camel %>;
  }

  /**
  * <%= domain %> 생성
  * @param {Create<%= pascal %>DTO} data <%= domain %> 생성 정보
  * @returns {Promise<<%= pascal %>>} 생성된 <%= domain %> 정보
  */
  async create(data: Create<%= pascal %>DTO): Promise<<%= pascal%>> {
    return this.prisma.$transaction(async (tx) => {
      const <%= camel %> = await tx.<%= camel %>.create({ data });

      return <%= camel %>;
    })
  }

  /**
  * <%= domain %> 수정
  * @param {string} id <%= domain %> ID
  * @param {Update<%= pascal %>DTO} data <%= domain %> 수정 정보
  * @returns {Promise<<%= pascal %>>} 수정된 <%= domain %> 정보
  */
  async update(id:string, data: Update<%= pascal %>DTO): Promise<<%= pascal %>> {
    return this.prisma.$transaction(async (tx) => {
      const <%= camel %> = await tx.<%= camel %>.findUnique({ where: { id } });

      if (!<%= camel %>) {
        throw new NotFoundException('해당 <%= domain %>을(를) 찾을 수 없습니다.');
      }

      const updated = tx.<%= camel %>.update({ 
        where: { 
          id,
        },
        data,
      });  

      return updated;
    });
  }

  /**
  * <%= domain %> 삭제
  * @param {string} id <%= domain %> ID
  * @returns {Promise<<%= pascal %>>} 삭제된 <%= domain %> 정보
  */
  async delete(id: string): Promise<<%= pascal %>> {
    return this.prisma.$transaction(async (tx) => {

      const <%= camel %> = await tx.<%= camel %>.findUnique({ where: { id } });

      if (!<%= camel %>) {
        throw new NotFoundException('해당 <%= domain %>을(를) 찾을 수 없습니다.');
      }  

      const deleted = await tx.<%= camel %>.delete({ where: { id } });

      return deleted
    });
  }
}
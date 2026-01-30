import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Min, Validate } from 'class-validator';

export class CommonSearchOptionDTO {
  @ApiProperty({ description: '페이지 크기', minimum: 1, example: 10 })
  @Type(() => Number)
  @IsNotEmpty({ message: '페이지 크기를 입력해주세요' })
  @Min(1, { message: '페이지 크기는 1 이상이어야 합니다' })
  pageSize?: number;

  @ApiProperty({ description: '정렬 기준', required: false })
  @IsOptional()
  orderBy?: string;

  @ApiProperty({
    description: '정렬 방향',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: '정렬 방향은 asc 또는 desc 중 하나여야 합니다',
  })
  align?: 'asc' | 'desc';

  @ApiProperty({ description: '검색어', required: false })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  query?: string;
}

export class OffsetSearchOptionDTO extends CommonSearchOptionDTO {
  @ApiProperty({
    description: '페이지 번호',
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: '페이지 번호는 1 이상이어야 합니다' })
  @Validate(({ object }) => !object.pageSize, {
    message: '올바르지 않은 요청입니다.',
  })
  @Validate(({ object }) => !!object.cursor, {
    message: '올바르지 않은 요청입니다.',
  })
  pageNo: number;
}

export class CursorSearchOptionDTO extends CommonSearchOptionDTO {
  @ApiProperty({ description: '커서', required: false })
  @IsOptional()
  @Validate(({ object }) => !!object.pageNo, {
    message: '올바르지 않은 요청입니다.',
  })
  @Validate(({ object }) => !object.pageSize, {
    message: '올바르지 않은 요청입니다.',
  })
  cursor?: string;
}

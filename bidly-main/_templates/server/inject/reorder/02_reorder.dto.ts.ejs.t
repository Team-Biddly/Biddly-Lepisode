---
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/dtos/reorder-${kebab}.dto.ts` : null %>"
---
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Reorder<%= pascal %>DTO {
  @ApiProperty({ description: 'prev' })
  @IsNotEmpty({ message: '이전 인덱스를 입력해 주세요.' })
  prev: number;

  @ApiProperty({ description: 'current' })
  @IsNotEmpty({ message: '현재 인덱스를 입력해 주세요.' })
  current: number;
}
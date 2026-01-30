---
to: 'apps/server/src/app/<%= kebab %>/dtos/<%= kebab %>.dto.ts'
---
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class <%= pascal %>DTO {
  @ApiProperty({
    description: '<%= domain %> ID',
  })
  @Expose()
  id: string;

  // Add more properties here

  @ApiProperty({
    description: '<%= domain %> 생성일',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '<%= domain %> 수정일',
  })
  @Expose()
  updatedAt: Date;
}
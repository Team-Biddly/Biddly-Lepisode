---
to: 'apps/server/src/app/<%= kebab %>/dtos/create-<%= kebab %>.dto.ts'
---
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create<%= pascal %>DTO {
    // Add properties here
}
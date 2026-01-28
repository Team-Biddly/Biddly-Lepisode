---
to: 'apps/server/src/app/<%= kebab %>/dtos/update-<%= kebab %>.dto.ts'
---
import { Create<%= pascal %>DTO } from './create-<%= kebab %>.dto';
import { PartialType } from '@nestjs/swagger';

export class Update<%= pascal %>DTO extends PartialType(Create<%= pascal %>DTO) {
    // Add properties here
}
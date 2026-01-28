---
to: 'apps/server/src/app/<%= kebab %>/<%= kebab %>.module.ts'
---
import { Module } from '@nestjs/common';
import { <%= pascal %>Controller } from './<%= kebab %>.controller';
import { <%= pascal %>Service } from './<%= kebab %>.service';

@Module({
  providers: [<%= pascal %>Service],
  controllers: [<%= pascal %>Controller],
})
export class <%= pascal %>Module {}
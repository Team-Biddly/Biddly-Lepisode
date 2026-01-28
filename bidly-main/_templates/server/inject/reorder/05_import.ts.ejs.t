---
inject: true
to: apps/server/src/app/<%= kebab %>/<%= kebab %>.controller.ts
prepend: true
---
import { Reorder<%= pascal %>DTO } from './dtos/reorder-<%= kebab %>.dto';
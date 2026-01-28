---
to: apps/server/src/libs/decorators/offset-pagination.decorator.ts
---
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { OffsetPaginationDTO } from '../dtos/offset-pagination.dto';

export const ApiOffsetPagination = <OffsetPaginationDTO extends Type<unknown>>(
  item: any
) =>
  applyDecorators(
    ApiExtraModels(OffsetPaginationDTO),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(OffsetPaginationDTO) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(item) },
              },
            },
          },
        ],
      },
    })
  );
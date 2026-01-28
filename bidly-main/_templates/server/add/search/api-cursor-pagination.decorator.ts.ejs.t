---
to: apps/server/src/libs/decorators/cursor-pagination.decorator.ts
---
import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { CursorPaginationDTO } from "../dtos/cursor-pagination.dto";

export const ApiCursorPagination = <CursorPaginationDTO extends Type<unknown>>(
  item: any,
) =>
  applyDecorators(
    ApiExtraModels(CursorPaginationDTO),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(CursorPaginationDTO) },
          {
            properties: {
              items: {
                type: "array",
                items: { $ref: getSchemaPath(item) },
              },
            },
          },
        ],
      },
    }),
  );

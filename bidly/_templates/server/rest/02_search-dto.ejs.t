---
to: 'apps/server/src/app/<%= kebab %>/dtos/search-<%= kebab %>.dto.ts'
---
import { SearchOffsetOptionDTO, CursorSearchOptionDTO } from "../../../libs/dtos/search-option.dto";

export class <%= pascal %>SearchOffsetOptionDTO extends SearchOffsetOptionDTO {
    // Add your properties here
}

export class <%= pascal %>CursorSearchOptionDTO extends CursorSearchOptionDTO {
    // Add your properties here
}
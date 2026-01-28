---
inject: true
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/${kebab}.controller.ts` : null %>"
at_line: "<%= methodLineNumber %>"
---
  @Patch('reorder')
  @ApiOperation({
    summary: '<%= domain %> 순서 변경',
    description: '<%= domain %>의 순서를 변경합니다.',
  })
  @ApiOkResponse({ 
    description: '<%= domain %> 순서 변경 성공',
    type: <%= pascal %>DTO 
  })
  async reorder(@Body() data: Reorder<%= pascal %>DTO) {
    const { prev, current } = data;
    const updated = await this.<%= camel %>Service.reorder(prev, current);

    return plainToInstance(<%= pascal %>DTO, updated);
  }
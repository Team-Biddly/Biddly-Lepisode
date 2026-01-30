---
inject: true
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/${kebab}.service.ts` : null %>"
at_line: <%= createLine %>
---
//      const maxOrder = await tx.<%= camel %>.findFirst({
//        select: { order: true },
//        orderBy: { order: 'desc' },
//        take: 1,
//      });
//
//      const <%= camel %> = await tx.<%= camel %>.create({
//        data: {
//          ...data,
//          order: maxOrder?.order ? maxOrder.order + 1 : 1,
//        },
//      });
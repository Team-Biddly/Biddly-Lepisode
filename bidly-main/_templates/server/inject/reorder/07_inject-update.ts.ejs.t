---
inject: true
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/${kebab}.service.ts` : null %>"
at_line: <%= updateLine %>
---
//      const updated = await tx.<%= camel %>.update({
//        where: { id },
//        data: {
//          ...data,
//        },
//      });
//
//      const <%= h.inflection.pluralize(camel) %> = await tx.<%= camel %>.findMany({
//        orderBy: { order: 'asc' },
//      });
//
//      let newOrder = 1;
//
//      for (const <%= camel %> of <%= h.inflection.pluralize(camel) %>) {
//        if (<%= camel %>.order !== newOrder) {
//          await tx.<%= camel %>.update({
//            where: { id: <%= camel %>.id },
//            data: { order: newOrder },
//          });
//        }
//
//        newOrder++;
//      }
//      
//      return updated;
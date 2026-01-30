---
inject: true
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/${kebab}.service.ts` : null %>"
at_line: <%= deleteLine %>
---
//     const deleted = await tx.<%= camel %>.delete({ where: { id } });
//
//     const <%= h.inflection.pluralize(camel) %> = await this.prisma.<%= camel %>.findMany({
//        where: { id: { notIn: [deleted.id] } },
//        orderBy: { order: 'asc' },
//      });
//
//      <%= h.inflection.pluralize(camel) %>.map(async (<%= camel %>, index) => {
//        return await this.prisma.<%= camel %>.update({
//          data: { order: index + 1 },
//          where: { id: <%= camel %>.id },
//        });
//      });
//
//      return deleted;
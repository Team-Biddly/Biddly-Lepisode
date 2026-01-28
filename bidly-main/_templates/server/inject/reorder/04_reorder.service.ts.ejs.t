---
inject: true
to: "<%= logic === 'Reorder' ? `apps/server/src/app/${kebab}/${kebab}.service.ts` : null %>"
at_line: "<%= lastLine %>"
---
  /**
   * <%= domain %>의 순서를 변경합니다.
   * @param {number} prev 이전 인덱스
   * @param {number} current 현재 인덱스
   * @returns {Promise<<%= pascal %>>} 변경된 <%= domain %> 정보
   */
  async reorder(prev: number, current: number) {
    const toBeMoved = await this.prisma.<%= camel %>.findFirst({
      where: { order: prev + 1 },
    });

    if (!toBeMoved) {
      throw new NotFoundException('해당 배너를 찾을 수 없습니다.');
    }

    current += 1;

    return await this.prisma.$transaction(async (tx) => {
      const [minOrder, maxOrder] = [
        Math.min(toBeMoved.order, current),
        Math.max(toBeMoved.order, current),
      ];

      const toBeUpdatedItems = await tx.<%= camel %>.findMany({
        where: {
          order:
            toBeMoved.order < current
              ? { gt: minOrder, lte: maxOrder }
              : { gte: minOrder, lt: maxOrder },
        },
        orderBy: { order: 'asc' },
      });

      for (const item of toBeUpdatedItems) {
        await tx.<%= camel %>.update({
          where: { id: item.id },
          data: {
            order: item.order + (toBeMoved.order < current ? -1 : 1),
          },
        });
      }

      const updated = await tx.<%= camel %>.update({
        where: { id: toBeMoved.id },
        data: { order: current },
      });

      const items = await tx.<%= camel %>.findMany({
        orderBy: { order: 'asc' },
      });

      let newOrder = 1;

      for (const item of items) {
        if (item.order !== newOrder) {
          await tx.<%= camel %>.update({
            where: { id: item.id },
            data: { order: newOrder },
          });
        }

        newOrder++;
      }

      return updated;
    });
  }
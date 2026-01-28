import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

/**
 * Prisma Client Extension을 포함한 Client
 */
const extendedClient = () => {
  const client = () =>
    new PrismaClient().$extends({
      model: {
        $allModels: {
          async exists<T>(
            this: T,
            where: Prisma.Args<T, 'findFirst'>['where'],
          ): Promise<boolean> {
            const context = Prisma.getExtensionContext(this);

            const result = await (context as any).findFirst({ where });

            return result != null;
          },
          async createIfNotExists<T>(
            this: T,
            data: Prisma.Args<T, 'create'>['data'],
          ): Promise<T> {
            const context = Prisma.getExtensionContext(this);

            const exists = await (context as any).exists({
              where: { id: data.id },
            });

            if (exists) {
              return (context as any).findUnique({ where: { id: data.id } });
            }

            return (context as any).create({ data });
          },
        },
      },
    });

  return class {
    constructor() {
      return client();
    }
  } as new () => ReturnType<typeof client>;
};

@Injectable()
export class PrismaService extends extendedClient() implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * 모델 이름의 앞글자에 따라 ID를 생성합니다.
   * @param {Prisma.ModelName | Lowercase<Prisma.ModelName>} modelName
   * @returns {string} 생성된 ID
   */
  getId(modelName: Prisma.ModelName | Lowercase<Prisma.ModelName>): string {
    const start = modelName.at(0).toUpperCase();
    const date = dayjs().format('YYMMDD');
    const randomDigits = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    return `${start}${date}${randomDigits}`;
  }
}

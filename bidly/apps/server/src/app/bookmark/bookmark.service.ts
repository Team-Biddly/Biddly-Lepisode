import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookmarkModelName } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  check(request: {
    userId: string;
    modelName: BookmarkModelName;
    modelId: string;
  }) {
    return this.prisma.bookmark.findUnique({
      where: {
        modelName_modelId_userId: request,
      },
    });
  }

  async toggle(request: {
    userId: string;
    modelName: BookmarkModelName;
    modelId: string;
  }): Promise<boolean> {
    const check = await this.check(request);
    if (check) {
      await this.prisma.bookmark.delete({ where: { id: check.id } });
      return false;
    } else {
      await this.prisma.bookmark.create({ data: request });
      return true;
    }
  }
}

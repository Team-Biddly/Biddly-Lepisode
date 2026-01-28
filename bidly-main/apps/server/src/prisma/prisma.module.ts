import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma 모듈
 * @description 어플리케이션 전역에서 사용하는 PrismaService를 제공하는 모듈
 * {@link PrismaService}
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

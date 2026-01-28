import { Module } from '@nestjs/common';
import { BannerController } from './controllers/banner.controller';
import { BannerService } from './services/banner.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileEngineService } from './file-engine.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FileEngineService],
  exports: [FileEngineService],
})
export class FileEngineModule {}

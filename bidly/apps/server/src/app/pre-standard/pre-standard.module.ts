import { Module } from '@nestjs/common';
import { PreStandardService } from './pre-standard.service';
import { PreStandardController } from './pre-standard.controller';
import { PreStandardSyncService } from './pre-standard-sync.service';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [DocumentModule],
  controllers: [PreStandardController],
  providers: [PreStandardService, PreStandardSyncService],
})
export class PreStandardModule {}

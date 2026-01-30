import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { BidSyncService } from './bid-sync.service';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [DocumentModule],
  controllers: [BidController],
  providers: [BidService, BidSyncService],
})
export class BidModule {}

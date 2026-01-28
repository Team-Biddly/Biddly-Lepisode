import { Module } from '@nestjs/common';
import { HwpService } from './hwp/hwp.service';
import { WordService } from './word/word.service';
import { DocumentParseService } from './document-parse.service';

@Module({
  providers: [DocumentParseService, HwpService, WordService],
  exports: [DocumentParseService],
})
export class DocumentModule {}

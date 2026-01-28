import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogEventListenerService } from './log.event-listener.service';

@Module({
  controllers: [LogController],
  providers: [LogService, LogEventListenerService],
  exports: [LogService],
})
export class LogModule {}

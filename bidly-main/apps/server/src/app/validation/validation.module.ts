import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ValidationController } from './validation.controller';

@Module({
  controllers: [ValidationController],
  imports: [HttpModule],
  providers: [ValidationService],
})
export class ValidationModule {}

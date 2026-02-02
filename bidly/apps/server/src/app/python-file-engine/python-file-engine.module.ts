import { Module } from '@nestjs/common';
import { FileEngineModule } from '../../../../../libs/api-client/src/file-engine/file-engine.module';
import { PythonFileEngineController } from './python-file-engine.controller';

@Module({
  imports: [FileEngineModule],
  controllers: [PythonFileEngineController],
  providers: [],
})
export class PythonFileEngineModule {}

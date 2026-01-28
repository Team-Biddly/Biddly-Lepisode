import { DynamicModule, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AI_MODULE_OPTIONS } from './ai.module.const';

export type AiModuleOptions = {
  apiKey: string;
  organization?: string;
};

@Module({})
export class AiModule {
  static register(options: AiModuleOptions): DynamicModule {
    return {
      module: AiModule,
      controllers: [AiController],
      global: true,
      providers: [
        {
          provide: AI_MODULE_OPTIONS,
          useValue: options,
        },
        AiService,
      ],
      exports: [AiService],
    };
  }
}

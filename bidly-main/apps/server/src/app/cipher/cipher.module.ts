import { DynamicModule, Module } from '@nestjs/common';
import { CIPHER_MODULE_CONFIG } from './cipher.module.const';
import { CipherModuleConfig } from './cipher.module.type';
import { CipherService } from './cipher.service';

@Module({})
export class CipherModule {
  static forRoot(option: CipherModuleConfig): DynamicModule {
    return {
      module: CipherModule,
      global: true,
      providers: [
        {
          provide: CIPHER_MODULE_CONFIG,
          useValue: option,
        },
        CipherService,
      ],
      exports: [CipherService],
    };
  }
}

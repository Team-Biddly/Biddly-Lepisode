import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { OpenAPIOrderPlanService } from './order-plan/order-plan.service';
import { OPENAPI_MODULE_OPTIONS } from './open-api.module.const';
import { OpenAPIBidService } from './bid/bid.service';
import { OpenAPIPreStandardService } from './pre-standard/pre-standard.service';
import { DocumentModule } from '../document/document.module';

export type OpenAPIModuleOptions = {
  serviceKey: string;
};

@Module({})
export class OpenAPIModule {
  static register(options: OpenAPIModuleOptions): DynamicModule {
    if (!options.serviceKey)
      throw new Error('Service key is required for OpenAPIModule');

    return {
      module: OpenAPIModule,
      imports: [HttpModule, DocumentModule],
      global: true,
      providers: [
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: options,
        },
        OpenAPIOrderPlanService,
        OpenAPIBidService,
        OpenAPIPreStandardService,
      ],
      exports: [
        OpenAPIOrderPlanService,
        OpenAPIBidService,
        OpenAPIPreStandardService,
      ],
    };
  }
}

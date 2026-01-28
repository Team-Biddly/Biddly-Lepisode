import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { OPENAPI_MODULE_OPTIONS } from '../open-api/open-api.module.const';
import { OpenAPIPreStandardService } from '../open-api/pre-standard/pre-standard.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PreStandardSyncService } from './pre-standard-sync.service';
describe('SyncPreStandardService', () => {
  let service: PreStandardSyncService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, PrismaModule],
      providers: [
        PreStandardSyncService,
        OpenAPIPreStandardService,
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: {
            serviceKey:
              '48WCpgWJc7OBS/O/SXGK4JwCOjo3/Nyfmxmo+FOXkjRBdSPK8zKAcFC9zFIJbhWv76On3OAYL0WknZmjna12mw==',
          },
        },
      ],
    }).compile();

    service = module.get<PreStandardSyncService>(PreStandardSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncThingPreStandards', () => {
    it('should sync construction order plans', async () => {
      const result = await service.syncThingPreStandards();
      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.apiCalls).toBeGreaterThan(0);
    }, 100000);
  });
});

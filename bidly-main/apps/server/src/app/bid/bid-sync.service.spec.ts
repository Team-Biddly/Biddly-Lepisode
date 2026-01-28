import { Test } from '@nestjs/testing';
import { BidSyncService } from './bid-sync.service';
import { HttpModule } from '@nestjs/axios';
import { OPENAPI_MODULE_OPTIONS } from '../open-api/open-api.module.const';
import { OpenAPIBidService } from '../open-api/bid/bid.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { DocumentParseService } from '../document/document-parse.service';
import { HwpService } from '../document/hwp/hwp.service';
import { WordService } from '../document/word/word.service';
describe('SyncBidService', () => {
  let service: BidSyncService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BidSyncService,
        OpenAPIBidService,
        {
          provide: PrismaService,
          useValue: {
            bid_Construction: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn(),
            },
            bid_Foreign: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn(),
            },
          },
        },
        {
          provide: AiService,
          useValue: {
            generateKeywords: jest
              .fn()
              .mockResolvedValue(['keyword1', 'keyword2']),
          },
        },
        {
          provide: DocumentParseService,
          useValue: {
            parse: jest.fn(),
            extractTextFromUrl: jest
              .fn()
              .mockResolvedValue('Extracted text from document'),
          },
        },
        {
          provide: HwpService,
          useValue: {
            parse: jest.fn().mockReturnValue('Parsed HWP content'),
          },
        },
        {
          provide: WordService,
          useValue: {
            parse: jest.fn().mockResolvedValue('Parsed Word content'),
          },
        },
        {
          provide: OPENAPI_MODULE_OPTIONS,
          useValue: {
            serviceKey:
              '48WCpgWJc7OBS/O/SXGK4JwCOjo3/Nyfmxmo+FOXkjRBdSPK8zKAcFC9zFIJbhWv76On3OAYL0WknZmjna12mw==',
          },
        },
      ],
    }).compile();

    service = module.get<BidSyncService>(BidSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncBidConstructions', () => {
    it('should sync bid constructions', async () => {
      const upsertSpy = jest.spyOn(
        service['prisma'].bid_Construction,
        'createIfNotExists',
      );

      const result = await service.syncBidConstructions();
      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.apiCalls).toBeGreaterThan(0);
      expect(upsertSpy).toHaveBeenCalled();
    });
  });

  describe('syncBidForeign', () => {
    it('should sync foreign bid', async () => {
      const result = await service.syncBidForeign(new Date('2024-06-20'));
      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.apiCalls).toBeGreaterThan(0);
    });
  });
});

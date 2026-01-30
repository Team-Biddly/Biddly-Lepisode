import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { AI_MODULE_OPTIONS } from './ai.module.const';
import { DocumentParseService } from '../document/document-parse.service';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DocumentModule } from '../document/document.module';

describe('AiService', () => {
  let service: AiService;
  let documentParseService: DocumentParseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DocumentModule],
      providers: [
        {
          provide: AI_MODULE_OPTIONS,
          useValue: {
            apiKey:
              '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',
          },
        },
        AiService,
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    documentParseService =
      module.get<DocumentParseService>(DocumentParseService);
  });

  describe('extractKeywords', () => {
    it('should extract keywords from the given text', async () => {
      const text = '전동차용 친환경 수성페인트 등 5종 제조구매 단가계약';
      const keywords = await service.extractKeywords(text);
      console.log({ keywords });
      expect(keywords).toBeDefined();
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
    }, 30000);

    it('should extract keywords from document', async () => {
      const path = join(__dirname, './gpu-1.hwp');
      const exists = existsSync(path);
      if (!exists) {
        console.warn('File does not exist:', path);
        return;
      }
      const buffer = readFileSync(path);
      const content = await documentParseService.parse(buffer);
      if (!content) return;

      const keywords = await service.extractKeywords(content);

      console.log({ keywords });
      expect(keywords).toBeDefined();
    });
  });
});

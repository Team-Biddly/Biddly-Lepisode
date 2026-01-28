import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { WordService } from './word.service';

describe('WordService', () => {
  let service: WordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordService],
    }).compile();

    service = module.get<WordService>(WordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parse', () => {
    it('should parse word document', async () => {
      const file = readFileSync(
        join(__dirname, 'BAC_랭귀지포인트_검사 결과보고서_R1(자문반영).docx'),
      );

      const parsed = await service.parse(file);

      expect(parsed).toBeDefined();
    });
  });
});

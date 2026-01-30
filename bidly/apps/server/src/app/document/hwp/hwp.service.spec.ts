import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HwpService } from './hwp.service';

describe('HwpService', () => {
  let service: HwpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HwpService],
    }).compile();

    service = module.get<HwpService>(HwpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parse', () => {
    it('should parse', async () => {
      const file = readFileSync(join(__dirname, 'test1.hwp'));

      const parsed = service.parse(file);
      console.log(parsed);

      expect(parsed).toBeDefined();
    });
  });
});

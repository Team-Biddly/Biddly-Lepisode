import { Test, TestingModule } from '@nestjs/testing';
import { PreStandardService } from './pre-standard.service';

describe('PreStandardService', () => {
  let service: PreStandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreStandardService],
    }).compile();

    service = module.get<PreStandardService>(PreStandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

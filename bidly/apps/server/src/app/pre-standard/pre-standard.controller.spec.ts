import { Test, TestingModule } from '@nestjs/testing';
import { PreStandardController } from './pre-standard.controller';
import { PreStandardService } from './pre-standard.service';

describe('PreStandardController', () => {
  let controller: PreStandardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreStandardController],
      providers: [PreStandardService],
    }).compile();

    controller = module.get<PreStandardController>(PreStandardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BarController } from './bar.controller';
import { BarService } from './bar.service';

describe('BarController', () => {
  let controller: BarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarController],
      providers: [BarService],
    }).compile();

    controller = module.get<BarController>(BarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

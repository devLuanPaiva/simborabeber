import { Test, TestingModule } from '@nestjs/testing';
import { TabItemService } from './tab-item.service';

describe('TabItemService', () => {
  let service: TabItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabItemService],
    }).compile();

    service = module.get<TabItemService>(TabItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

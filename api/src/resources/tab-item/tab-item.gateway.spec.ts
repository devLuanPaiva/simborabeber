import { Test, TestingModule } from '@nestjs/testing';
import { TabItemGateway } from './tab-item.gateway';
import { TabItemService } from './tab-item.service';

describe('TabItemGateway', () => {
  let gateway: TabItemGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabItemGateway, TabItemService],
    }).compile();

    gateway = module.get<TabItemGateway>(TabItemGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

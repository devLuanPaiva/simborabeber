import { Module } from '@nestjs/common';
import { TabItemService } from './tab-item.service';
import { TabItemGateway } from './tab-item.gateway';

@Module({
  providers: [TabItemGateway, TabItemService],
})
export class TabItemModule {}

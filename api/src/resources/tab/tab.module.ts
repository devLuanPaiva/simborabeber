import { Module } from '@nestjs/common';
import { TabService } from './tab.service';
import { TabController } from './tab.controller';

@Module({
  controllers: [TabController],
  providers: [TabService],
})
export class TabModule {}

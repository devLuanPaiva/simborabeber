import { Module, forwardRef } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TabModule } from '../tab/tab.module';
import { BarModule } from '../bar/bar.module';
import { AuthModule } from '../auth/auth.module';
import { TabItemModule } from '../tab-item/tab-item.module';

@Module({
  controllers: [ReportsController],
  imports: [forwardRef(() => TabModule), forwardRef(() => BarModule), forwardRef(() => TabItemModule), AuthModule],
  providers: [ReportsService],
})
export class ReportsModule { }

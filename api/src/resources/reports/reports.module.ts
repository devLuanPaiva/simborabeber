import { Module, forwardRef } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TabModule } from '../tab/tab.module';
import { BarModule } from '../bar/bar.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ReportsController],
  imports: [forwardRef(() => TabModule), forwardRef(() => BarModule), AuthModule],
  providers: [ReportsService],
})
export class ReportsModule { }

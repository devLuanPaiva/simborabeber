import { Module } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';

@Module({
  controllers: [BarController],
  providers: [BarService],
})
export class BarModule {}

import { Module } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarEntity } from './entities/bar.entity';
import { BarRepository } from './repository/bar.repository';

@Module({
  controllers: [BarController],
  imports: [TypeOrmModule.forFeature([BarEntity])],
  providers: [BarService, BarRepository],
  exports: [BarService, BarRepository]
})
export class BarModule { }

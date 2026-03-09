import { Module } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarEntity } from './entities/bar.entity';
import { BarRepository } from './repository/bar.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BarController],
  imports: [TypeOrmModule.forFeature([BarEntity]), AuthModule],
  providers: [BarService, BarRepository],
  exports: [BarService, BarRepository]
})
export class BarModule { }

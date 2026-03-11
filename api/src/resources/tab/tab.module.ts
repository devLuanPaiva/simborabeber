import { Module, forwardRef } from '@nestjs/common';
import { TabService } from './tab.service';
import { TabController } from './tab.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabEntity } from './entities/tab.entity';
import { AuthModule } from '../auth/auth.module';
import { BarModule } from '../bar/bar.module';
import { UserModule } from '../user/user.module';
import { TabRepository } from './repository/tab.repository';

@Module({
  controllers: [TabController],
  imports: [TypeOrmModule.forFeature([TabEntity]), AuthModule, forwardRef(() => BarModule), forwardRef(() => UserModule)],
  providers: [TabService, TabRepository],
  exports: [TabService, TabRepository, TypeOrmModule]
})
export class TabModule { }
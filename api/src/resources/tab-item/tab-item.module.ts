import { forwardRef, Module } from '@nestjs/common';
import { TabItemService } from './tab-item.service';
import { TabItemGateway } from './tab-item.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabItemEntity } from './entities/tab-item.entity';
import { AuthModule } from '../auth/auth.module';
import { TabModule } from '../tab/tab.module';
import { TabItemsRepository } from './repository/tab-item.repository';
import { TabItemController } from './tab-item.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TabItemController],
  imports: [TypeOrmModule.forFeature([TabItemEntity]), AuthModule, forwardRef(() => TabModule), UserModule],
  providers: [TabItemGateway, TabItemService, TabItemsRepository],
  exports: [TabItemService, TabItemsRepository],
})
export class TabItemModule { }

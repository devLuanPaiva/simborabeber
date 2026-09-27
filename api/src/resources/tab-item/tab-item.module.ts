import { forwardRef, Module } from '@nestjs/common';
import { TabItemService } from './tab-item.service';
import { TabItemGateway } from './tab-item.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabItemEntity } from './entities/tab-item.entity';
import { TabItemComponentEntity } from './entities/tab-item-component.entity';
import { TabItemAddonEntity } from './entities/tab-item-addon.entity';
import { AuthModule } from '../auth/auth.module';
import { TabModule } from '../tab/tab.module';
import { TabItemsRepository } from './repository/tab-item.repository';
import { TabItemController } from './tab-item.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { ProductAddonModule } from '../product-addon/product-addon.module';

@Module({
  controllers: [TabItemController],
  imports: [
    TypeOrmModule.forFeature([TabItemEntity, TabItemComponentEntity, TabItemAddonEntity]),
    AuthModule,
    forwardRef(() => TabModule),
    UserModule,
    forwardRef(() => ProductModule),
    forwardRef(() => ProductVariantModule),
    forwardRef(() => ProductAddonModule),
  ],
  providers: [TabItemGateway, TabItemService, TabItemsRepository],
  exports: [TabItemService, TabItemsRepository],
})
export class TabItemModule { }

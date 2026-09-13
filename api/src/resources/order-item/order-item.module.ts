import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemComponentEntity } from './entities/order-item-component.entity';
import { OrderItemAddonEntity } from './entities/order-item-addon.entity';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemRepository } from './repository/order-item.repository';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [OrderItemController],
  imports: [
    TypeOrmModule.forFeature([OrderItemEntity, OrderItemComponentEntity, OrderItemAddonEntity]),
    AuthModule,
    forwardRef(() => OrderModule),
    UserModule,
  ],
  providers: [OrderItemService, OrderItemRepository],
  exports: [OrderItemService, OrderItemRepository],
})
export class OrderItemModule { }

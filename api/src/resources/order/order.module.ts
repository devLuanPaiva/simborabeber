import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderGateway } from './order.gateway';
import { OrderRepository } from './repository/order.repository';
import { AuthModule } from '../auth/auth.module';
import { BarModule } from '../bar/bar.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 10 }]),
    AuthModule,
    forwardRef(() => BarModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
  ],
  providers: [OrderService, OrderRepository, OrderGateway],
  exports: [OrderService, OrderRepository, OrderGateway, TypeOrmModule]
})
export class OrderModule { }

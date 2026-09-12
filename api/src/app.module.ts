import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BarModule } from './resources/bar/bar.module';
import { ProductModule } from './resources/product/product.module';
import { TabModule } from './resources/tab/tab.module';
import { TabItemModule } from './resources/tab-item/tab-item.module';
import { ReportsModule } from './resources/reports/reports.module';
import { OrderModule } from './resources/order/order.module';
import { OrderItemModule } from './resources/order-item/order-item.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), DatabaseModule, UserModule, AuthModule, BarModule, ProductModule, TabModule, TabItemModule, ReportsModule, OrderModule, OrderItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

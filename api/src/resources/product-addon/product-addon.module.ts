import { Module, forwardRef } from '@nestjs/common';
import { ProductAddonService } from './product-addon.service';
import { ProductAddonController } from './product-addon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarModule } from '../bar/bar.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ProductAddonEntity } from './entities/product-addon.entity';
import { ProductAddonRepository } from './repository/product-addon.repository';

@Module({
  controllers: [ProductAddonController],
  imports: [TypeOrmModule.forFeature([ProductAddonEntity]), forwardRef(() => BarModule), AuthModule, UserModule],
  providers: [ProductAddonService, ProductAddonRepository],
  exports: [ProductAddonService, ProductAddonRepository, TypeOrmModule]
})
export class ProductAddonModule { }

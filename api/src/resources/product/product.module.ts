import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarEntity } from '../bar/entities/bar.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './repository/product.repository';

@Module({
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([ProductEntity, BarEntity]), AuthModule, UserModule],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository]
})
export class ProductModule { }

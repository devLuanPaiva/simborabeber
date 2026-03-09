import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarEntity } from '../bar/entities/bar.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductEntity } from './entities/product.entity';

@Module({
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([ProductEntity, BarEntity]), AuthModule],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { ProductEntity } from '../product/entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductVariantController],
  imports: [TypeOrmModule.forFeature([ProductVariantEntity, ProductEntity]), AuthModule],
  providers: [ProductVariantService, ProductVariantRepository],
  exports: [ProductVariantService, ProductVariantRepository],
})
export class ProductVariantModule { }

import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantRepository } from './repository/product-variant.repository';

@Injectable()
export class ProductVariantService {

  constructor(
    private readonly productVariantRepository: ProductVariantRepository,
  ) { }

  createByProduct(productId: string, createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantRepository.createVariant(productId, createProductVariantDto);
  }

  findAllByProduct(productId: string) {
    return this.productVariantRepository.findAllByProductId(productId);
  }

  update(id: string, updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantRepository.updateVariant(id, updateProductVariantDto);
  }

  remove(id: string) {
    return this.productVariantRepository.deleteVariant(id);
  }
}

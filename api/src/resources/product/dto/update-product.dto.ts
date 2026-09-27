import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// Variants are managed through the dedicated /product-variant endpoints,
// not through a product PATCH, so they're excluded here.
export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['variants'] as const)) {}

import { PartialType } from '@nestjs/swagger';
import { CreateProductAddonDto } from './create-product-addon.dto';

export class UpdateProductAddonDto extends PartialType(CreateProductAddonDto) {}

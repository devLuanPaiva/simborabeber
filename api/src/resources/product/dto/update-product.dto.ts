import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser true ou false' })
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}

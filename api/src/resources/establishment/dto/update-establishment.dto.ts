import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEstablishmentDto } from './create-establishment.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEstablishmentDto extends PartialType(CreateEstablishmentDto) {
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser true ou false' })
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}

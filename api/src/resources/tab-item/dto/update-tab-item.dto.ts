import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateTabItemDto {
  @IsNotEmpty({ message: 'Quantidade do item é obrigatória' })
  @ApiProperty({ example: 10, description: 'Quantidade do item' })
  quantity: number
}

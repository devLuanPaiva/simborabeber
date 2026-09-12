import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class UpdateOrderItemQuantityDto {
    @IsNotEmpty({ message: 'Quantidade do item é obrigatória' })
    @IsInt({ message: 'Quantidade deve ser um número inteiro' })
    @Min(1, { message: 'Quantidade mínima é 1' })
    @ApiProperty({ example: 2, description: 'Nova quantidade do item' })
    quantity: number
}

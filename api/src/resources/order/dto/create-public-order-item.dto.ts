import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, MaxLength } from "class-validator";

export class CreatePublicOrderItemDto {
    @IsNotEmpty({ message: 'Produto é obrigatório' })
    @IsUUID('4', { message: 'Produto inválido' })
    @ApiProperty({ example: '8f14e45f-ceea-467e-9b1d-0e6c9c1a1b2c', description: 'ID do produto no catálogo do bar' })
    productId: string

    @IsNotEmpty({ message: 'Quantidade é obrigatória' })
    @IsInt({ message: 'Quantidade deve ser um número inteiro' })
    @Min(1, { message: 'Quantidade mínima é 1' })
    @ApiProperty({ example: 2, description: 'Quantidade do produto' })
    quantity: number

    @IsOptional()
    @IsString({ message: 'Observação deve ser uma string' })
    @MaxLength(255, { message: 'Observação deve ter no máximo 255 caracteres' })
    @ApiProperty({ example: 'Sem cebola', description: 'Observação do item', required: false })
    notes?: string
}

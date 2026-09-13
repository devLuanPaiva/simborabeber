import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"

export class CreateProductVariantDto {
    @IsNotEmpty({ message: 'Tamanho é obrigatório' })
    @IsString({ message: 'Tamanho deve ser uma string' })
    @MaxLength(20, { message: 'Tamanho deve ter no máximo 20 caracteres' })
    @ApiProperty({ example: 'G', description: 'Rótulo do tamanho/variação (ex: P, M, G, GG)' })
    label: string

    @IsNotEmpty({ message: 'Preço é obrigatório' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Preço não pode ser negativo' })
    @ApiProperty({ example: 45.9, description: 'Preço desta variação' })
    price: number

    @IsOptional()
    @IsInt({ message: 'Ordem deve ser um número inteiro' })
    @Min(0, { message: 'Ordem não pode ser negativa' })
    @ApiProperty({ example: 0, description: 'Ordem de exibição da variação', required: false })
    sortOrder?: number

    @IsNotEmpty({ message: 'Número de fatias é obrigatório' })
    @IsInt({ message: 'Número de fatias deve ser um número inteiro' })
    @Min(1, { message: 'Número de fatias deve ser ao menos 1' })
    @Max(100, { message: 'Número de fatias deve ser no máximo 100' })
    @ApiProperty({ example: 8, description: 'Número de fatias desta variação' })
    numberOfSlices: number

    @IsOptional()
    @IsBoolean({ message: 'Status deve ser um booleano' })
    @ApiProperty({ example: true, description: 'Se a variação está disponível', required: false })
    isActive?: boolean
}

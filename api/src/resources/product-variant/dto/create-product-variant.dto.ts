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

    @IsOptional()
    @IsInt({ message: 'Quantidade máxima de sabores deve ser um número inteiro' })
    @Min(1, { message: 'Quantidade máxima de sabores deve ser ao menos 1' })
    @Max(2, { message: 'Quantidade máxima de sabores é 2' })
    @ApiProperty({ example: 2, description: 'Quantos sabores podem ser combinados nesta variação (máximo 2)', required: false })
    maxFlavors?: number

    @IsOptional()
    @IsBoolean({ message: 'Status deve ser um booleano' })
    @ApiProperty({ example: true, description: 'Se a variação está disponível', required: false })
    isActive?: boolean
}

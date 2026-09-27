import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, MaxLength, ValidateNested } from "class-validator"

export class CreateTabItemDto {
    @IsNotEmpty({ message: 'Produto é obrigatório' })
    @IsUUID('4', { message: 'Produto inválido' })
    @ApiProperty({ example: '8f14e45f-ceea-467e-9b1d-0e6c9c1a1b2c', description: 'ID do produto no cardápio do bar' })
    productId: string

    @IsNotEmpty({ message: 'Quantidade do item é obrigatória' })
    @IsInt({ message: 'Quantidade deve ser um número inteiro' })
    @Min(1, { message: 'Quantidade mínima é 1' })
    @ApiProperty({ example: 10, description: 'Quantidade do item' })
    quantity: number

    @IsOptional()
    @IsString({ message: 'Observação deve ser uma string' })
    @MaxLength(255, { message: 'Observação deve ter no máximo 255 caracteres' })
    @ApiProperty({ example: 'Sem cebola', description: 'Observação do item', required: false })
    notes?: string

    @IsOptional()
    @IsUUID('4', { message: 'Variação inválida' })
    @ApiProperty({ example: '8f14e45f-ceea-467e-9b1d-0e6c9c1a1b2d', description: 'ID da variação (tamanho) escolhida, quando o produto tiver variações', required: false })
    variantId?: string

    @IsOptional()
    @IsUUID('4', { message: 'Produto do segundo sabor inválido' })
    @ApiProperty({ example: '8f14e45f-ceea-467e-9b1d-0e6c9c1a1b2e', description: 'ID do segundo sabor (produto), para itens meio a meio (opcional)', required: false })
    extraProductId?: string

    @IsOptional()
    @IsArray({ message: 'Adicionais deve ser um array' })
    @ArrayMaxSize(10, { message: 'Informe no máximo 10 adicionais' })
    @IsUUID('4', { each: true, message: 'Adicional inválido' })
    @ApiProperty({ example: ['8f14e45f-ceea-467e-9b1d-0e6c9c1a1b2f'], description: 'IDs dos adicionais escolhidos (opcional)', required: false })
    addonIds?: string[]
}

export class CreateManyTabItemsDto {
    @IsArray({ message: 'Items deve ser um array' })
    @ArrayMinSize(1, { message: 'Informe ao menos um item' })
    @ValidateNested({ each: true })
    @Type(() => CreateTabItemDto)
    @ApiProperty({ type: [CreateTabItemDto], description: 'Lista de items para cadastro em lote' })
    items: CreateTabItemDto[]
}

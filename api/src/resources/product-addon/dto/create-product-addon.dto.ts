import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength } from "class-validator"
import { ProductCategory } from "../../product/entities/product-category.enum"

export class CreateProductAddonDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString({ message: 'Nome deve ser uma string' })
    @MaxLength(120, { message: 'Nome deve ter no máximo 120 caracteres' })
    @ApiProperty({ example: 'Borda Catupiry', description: 'Nome do adicional' })
    name: string

    @IsNotEmpty({ message: 'Preço é obrigatório' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Preço não pode ser negativo' })
    @ApiProperty({ example: 8, description: 'Preço do adicional' })
    price: number

    @IsOptional()
    @IsEnum(ProductCategory, { message: 'Categoria inválida' })
    @ApiProperty({ example: ProductCategory.PIZZA, description: 'Restringe o adicional a uma categoria (opcional, vale para todas se omitido)', required: false })
    category?: ProductCategory

    @IsOptional()
    @IsBoolean({ message: 'Status deve ser um booleano' })
    @ApiProperty({ example: true, description: 'Se o adicional está disponível', required: false })
    isActive?: boolean
}

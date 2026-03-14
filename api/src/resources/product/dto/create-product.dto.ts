import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"
import { ProductCategory } from "../entities/product.entity"

export class CreateProductDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString({ message: 'Nome deve ser uma string' })
    @ApiProperty({ example: 'Coca-cola', description: 'Nome do produto' })
    name: string

    @IsNotEmpty({ message: 'Preço é obrigatório' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ example: 10.5, description: 'Preço do produto' })
    price: number

    @IsNotEmpty({ message: 'Descrição é obrigatória' })
    @IsString({ message: 'Descrição deve ser uma string' })
    @ApiProperty({ example: 'Refrigerante de cola', description: 'Descrição do produto', required: false })
    description: string

    @IsNotEmpty({ message: 'Categoria é obrigatória' })
    @IsEnum(ProductCategory, { message: 'Categoria deve ser uma das seguintes: beers, drinks, snacks, non_alcoholic, other' })
    @ApiProperty({ example: ProductCategory.DRINKS, description: 'Categoria do produto', enum: ProductCategory })
    category: ProductCategory

    @IsNotEmpty({ message: 'URL da imagem é obrigatória' })
    @IsString({ message: 'URL da imagem deve ser uma string' })
    @ApiProperty({ example: 'https://...', description: 'URL da imagem do produto' })
    image: string

}

export class CreateManyProductsDto {
    @IsArray({ message: 'Produtos deve ser um array' })
    @ArrayMinSize(1, { message: 'Informe ao menos um produto' })
    @ValidateNested({ each: true })
    @Type(() => CreateProductDto)
    @ApiProperty({ type: [CreateProductDto], description: 'Lista de produtos para cadastro em lote' })
    products: CreateProductDto[]
}

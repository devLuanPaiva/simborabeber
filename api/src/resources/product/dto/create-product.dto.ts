import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
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

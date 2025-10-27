import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength,
    ValidateNested,
    IsUUID,
} from "class-validator";
import { Category } from "../entities/product.entity";

export class CreateProductDto {
    @ApiProperty()
    @IsString({ message: "O nome deve ser uma string." })
    @MinLength(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    name: string

    @ApiProperty()
    @IsString({ message: "A descrição deve ser uma string." })
    @MinLength(10, { message: "A descrição deve ter pelo menos 10 caracteres." })
    description: string

    @ApiProperty()
    @IsNotEmpty({ message: "O preço de compra é obrigatório." })
    @IsNumber({}, { message: "O preço de compra deve ser um número." })
    @IsPositive({ message: "O preço de compra deve ser maior que zero." })
    purchasePrice: number

    @ApiProperty()
    @IsNotEmpty({ message: "O preço de venda é obrigatório." })
    @IsNumber({}, { message: "O preço de venda deve ser um número." })
    @IsPositive({ message: "O preço de venda deve ser maior que zero." })
    salePrice: number

    @ApiProperty({ enum: Category })
    @IsEnum(Category, { message: "A categoria fornecida é inválida." })
    category: Category

    @ApiProperty()
    @IsString({ message: "A URL da imagem deve ser uma string." })
    imageUrl: string

    @ApiProperty()
    @IsString({ message: "O código de barras deve ser uma string." })
    @MinLength(3, { message: "O código de barras deve ter pelo menos 3 caracteres." })
    barCode: string

    @ApiProperty()
    @IsNotEmpty({ message: "O campo 'Mostrar no Menu' é obrigatório." })
    @IsBoolean({ message: "O campo 'Mostrar no Menu' deve ser um booleano." })
    showInMenu: boolean;

    @ApiPropertyOptional({ type: () => [CreateEstablishmentProductDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateEstablishmentProductDto)
    establishmentProducts?: CreateEstablishmentProductDto[];

    @ApiPropertyOptional({ type: () => [CreateProductStockDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductStockDto)
    productStocks?: CreateProductStockDto[];
}


export class CreateEstablishmentProductDto {
    @ApiProperty({ description: 'ID do estabelecimento onde este produto está disponível' })
    @IsUUID('4', { message: 'O campo establishmentId deve ser um UUID válido.' })
    establishmentId: string

    @ApiPropertyOptional({ description: 'Código local utilizado pelo estabelecimento' })
    @IsOptional()
    @IsString({ message: 'O código local deve ser uma string.' })
    localCode?: string

    @ApiProperty({ description: 'Preço deste produto no estabelecimento' })
    @IsNumber({}, { message: 'O preço deve ser um número.' })
    @IsPositive({ message: 'O preço deve ser maior que zero.' })
    price: number

    @ApiPropertyOptional({ description: 'Indica se o estoque deve ser controlado para este produto no estabelecimento' })
    @IsOptional()
    @IsBoolean({ message: 'O campo trackInventory deve ser um valor booleano.' })
    trackInventory?: boolean

    @ApiPropertyOptional({ description: 'Indica se o produto está disponível no estabelecimento' })
    @IsOptional()
    @IsBoolean({ message: 'O campo available deve ser um valor booleano.' })
    available?: boolean
}

export class CreateProductStockDto {
    @ApiProperty({ description: 'ID do estabelecimento ao qual o estoque se aplica' })
    @IsUUID('4', { message: 'O identificador deve ser válido.' })
    establishmentId: string

    @ApiProperty({ description: 'Quantidade inicial deste produto no estabelecimento informado' })
    @IsNumber({}, { message: 'A quantidade deve ser um número.' })
    quantity: number
}

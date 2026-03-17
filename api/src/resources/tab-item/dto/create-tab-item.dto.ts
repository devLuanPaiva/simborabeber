import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator"

export class CreateTabItemDto {
    @IsNotEmpty({ message: 'Nome do item é obrigatório' })
    @IsString({ message: 'Nome do item deve ser uma string' })
    @ApiProperty({ example: 'Coca-cola', description: 'Nome do item' })
    name: string

    @IsNotEmpty({ message: 'Preço do item é obrigatório' })
    @ApiProperty({ example: 5.99, description: 'Preço do item' })
    price: number

    @IsNotEmpty({ message: 'Quantidade do item é obrigatória' })
    @ApiProperty({ example: 10, description: 'Quantidade do item' })
    quantity: number
}



export class CreateManyTabItemsDto {
    @IsArray({ message: 'Items deve ser um array' })
    @ArrayMinSize(1, { message: 'Informe ao menos um item' })
    @ValidateNested({ each: true })
    @Type(() => CreateTabItemDto)
    @ApiProperty({ type: [CreateTabItemDto], description: 'Lista de items para cadastro em lote' })
    items: CreateTabItemDto[]
}

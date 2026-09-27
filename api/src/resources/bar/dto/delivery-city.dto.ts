import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator"

export class DeliveryCityDto {
    @IsNotEmpty({ message: 'Nome da cidade é obrigatório' })
    @IsString({ message: 'Nome da cidade deve ser uma string' })
    @MaxLength(120, { message: 'Nome da cidade deve ter no máximo 120 caracteres' })
    @ApiProperty({ example: 'Cidade Vizinha', description: 'Nome da cidade de entrega' })
    name: string

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Taxa da cidade deve ser um número com até 2 casas decimais' })
    @Min(0, { message: 'Taxa da cidade não pode ser negativa' })
    @ApiProperty({ example: 8, description: 'Taxa de entrega cobrada para esta cidade' })
    fee: number
}

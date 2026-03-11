import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { TabStatus } from "../entities/tab.entity"

export class CreateTabDto {
    @IsNotEmpty({ message: 'Status é obrigatório' })
    @IsEnum(TabStatus, { message: 'Status deve ser OPEN ou CLOSED' })
    @ApiProperty({ example: TabStatus.OPEN, description: 'Status da comanda', enum: TabStatus })
    status: TabStatus

    @IsNotEmpty({ message: 'Número da mesa é obrigatório' })
    @IsNumber({}, { message: 'Número da mesa deve ser um número' })
    @ApiProperty({ example: 1, description: 'Número da mesa' })
    tableNumber: number

    @IsNotEmpty({ message: 'Nome do cliente é obrigatório' })
    @IsString({ message: 'Nome do cliente deve ser uma string' })
    @ApiProperty({ example: 'João', description: 'Nome do cliente' })
    customerName: string

    @IsNotEmpty({ message: 'Valor total é obrigatório' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor total deve ser um número com até 2 casas decimais' })
    @ApiProperty({ example: 100.5, description: 'Valor total da comanda' })
    totalValue: number
}

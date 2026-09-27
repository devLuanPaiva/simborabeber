import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator"
import { AccessPlan } from "../entities/bar.entity"
import { DeliveryCityDto } from "./delivery-city.dto"

export class CreateBarDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString({ message: 'Nome deve ser uma string' })
    @ApiProperty({ example: 'Bar do João', description: 'Nome do bar' })
    name: string

    @IsNotEmpty({ message: 'Slug é obrigatório' })
    @IsString()
    @ApiProperty({ example: 'bar-do-joao', description: 'Slug do bar', required: true })
    slug: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'https://...', description: 'URL da imagem do bar', required: false })
    image?: string

    @IsNotEmpty({ message: 'Endereço é obrigatório' })
    @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço do bar' })
    address: string
    @IsEnum(AccessPlan)
    @ApiProperty({ example: AccessPlan.BASIC, enum: AccessPlan, required: false })
    accessPlan?: AccessPlan

    @IsOptional()
    @IsBoolean({ message: 'comandasEnabled deve ser um booleano' })
    @ApiProperty({ example: true, description: 'Se o módulo de comandas está habilitado', required: false })
    comandasEnabled?: boolean

    @IsOptional()
    @IsBoolean({ message: 'deliveryEnabled deve ser um booleano' })
    @ApiProperty({ example: false, description: 'Se o módulo de delivery está habilitado', required: false })
    deliveryEnabled?: boolean

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Taxa de entrega deve ser um número com até 2 casas decimais' })
    @Min(0, { message: 'Taxa de entrega não pode ser negativa' })
    @ApiProperty({ example: 5, description: 'Taxa de entrega cobrada no delivery', required: false })
    deliveryFee?: number

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Pedido mínimo deve ser um número com até 2 casas decimais' })
    @Min(0, { message: 'Pedido mínimo não pode ser negativo' })
    @ApiProperty({ example: 20, description: 'Valor mínimo de pedido para delivery', required: false })
    minOrderValue?: number

    @IsOptional()
    @IsString({ message: 'Endereço de origem deve ser uma string' })
    @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço de origem para cálculo/exibição do delivery', required: false })
    deliveryOriginAddress?: string

    @IsOptional()
    @IsString({ message: 'Horário de funcionamento deve ser uma string' })
    @ApiProperty({ example: 'Ter-Dom, 18h-23h30', description: 'Horário de funcionamento (texto livre)', required: false })
    openingHours?: string

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => DeliveryCityDto)
    @ApiProperty({ type: [DeliveryCityDto], description: 'Cidades vizinhas com taxa de entrega própria', required: false })
    deliveryCities?: DeliveryCityDto[]
}

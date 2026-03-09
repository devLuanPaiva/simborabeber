import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { AccessPlan } from "../entities/bar.entity"

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



}

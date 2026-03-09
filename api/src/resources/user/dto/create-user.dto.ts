import { ApiProperty } from "@nestjs/swagger"
import {
    IsNotEmpty,
    IsEnum,
    IsString,
    MinLength,
    IsOptional,
} from "class-validator"
import { UserRole } from "../entities/user.entity"

export class CreateUserDto {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString({ message: "Nome deve ser uma string" })
    @MinLength(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    @ApiProperty({ example: "João Silva", description: "Nome completo do cliente" })
    name: string

    @IsNotEmpty({ message: "Email é obrigatório" })
    @IsString({ message: "Email deve ser uma string" })
    @ApiProperty({ example: "joao.silva@example.com", description: "Email do cliente" })
    email: string

    @IsNotEmpty({ message: "Senha é obrigatória" })
    @IsString({ message: "Senha deve ser uma string" })
    @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    @ApiProperty({ example: "senha123", description: "Senha do cliente" })
    password: string

    @IsNotEmpty({ message: "Cargo é obrigatório" })
    @IsEnum(UserRole, { message: "Cargo deve ser 'admin', 'manager' ou 'waiter'" })
    @ApiProperty({ example: "waiter", description: "Cargo do usuário", enum: UserRole })
    role: UserRole

    @IsString()
    @IsOptional()
    @ApiProperty({ example: null, description: 'ID do bar associado (apenas para admins)', required: false })
    barId?: string
}

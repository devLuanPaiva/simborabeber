import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../entities/user.entity"
export class CreateUserDto {
    @IsNotEmpty({ message: "O nome é obrigatório" })
    @ApiProperty({ example: "João Silva" })
    @IsString({ message: "O nome deve ser uma string" })
    name: string

    @IsEmail({}, { message: "E-mail inválido" })
    @ApiProperty({ example: "joao@email.com" })
    email: string

    @IsOptional()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    @ApiProperty({ example: "senha123", required: false })
    password?: string

    @IsEnum(Role)
    @ApiProperty({ example: "WAITER" })
    @IsString({ message: "O papel deve ser uma string" })
    role?: Role


}
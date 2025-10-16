import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"
export class AuthDto {
    @IsEmail({}, { message: "E-mail inválido" })
    @ApiProperty({ example: "joao@email.com" })
    email: string

    @IsNotEmpty({ message: "A senha é obrigatória" })
    @ApiProperty({ example: "senha123" })
    password: string
}

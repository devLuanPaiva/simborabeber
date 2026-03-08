import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'Email é obrigatório' })
    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @IsString({ message: 'Senha deve ser uma string' })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @ApiProperty({ example: 'password123' })
    password: string;
}

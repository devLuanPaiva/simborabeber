import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/user.entity';
export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @ApiProperty({ example: 'João Silva' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({ example: 'senha123', required: false })
  password?: string;

  @IsEnum(Role)
  @ApiProperty({ example: 'WAITER' })
  @IsString({ message: 'O papel deve ser uma string' })
  role: Role;

  @IsOptional()
  @ApiProperty({ example: '8d6f56ac-34c1-4bc9-86c5-1c4d5edc6db9', required: false })
  @IsUUID('4', { message: 'O ID do estabelecimento deve ser um UUID válido' })
  establishmentId?: string;
}

export class UserDto {
  @IsUUID('4', { message: 'O ID do usuário deve ser um UUID válido' })
  @ApiProperty({ example: '8d6f56ac-34c1-4bc9-86c5-1c4d5edc6db9' })
  id: string;

  @IsEnum(Role, { message: 'O papel informado não é válido' })
  @ApiProperty({ example: 'MANAGER' })
  role: Role;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EstablishmentType } from '../entities/establishment.entity';

export class CreateEstablishmentDto {
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @ApiProperty({ example: 'churrasfogoebrasa@email.com' })
  email: string;

  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  @ApiProperty({ example: 'Churras do Fogo e Brasa' })
  name: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @ApiProperty({ example: EstablishmentType.RESTAURANTS })
  @IsEnum(EstablishmentType, { message: 'Tipo de estabelecimento inválido' })
  type: EstablishmentType;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @ApiProperty({ example: 'Rua das Flores, 123' })
  @IsString({ message: 'O endereço deve ser uma string' })
  address: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @ApiProperty({ example: '(11) 1234-5678' })
  @IsString({ message: 'O telefone deve ser uma string' })
  phone: string;

  @IsNotEmpty({ message: 'O slug é obrigatório' })
  @ApiProperty({ example: 'churras-do-fogo-e-brasa' })
  @IsString({ message: 'O slug deve ser uma string' })
  slug: string;
}

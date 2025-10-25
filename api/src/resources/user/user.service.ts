import { PrismaService } from './../../database/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleException } from '../../functions/handleException';
import { Role } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }
  async createUser(data: CreateUserDto) {
    try {
      await this.ensureEmailNotExists(data.email);

      const passwordHash = await bcrypt.hash(data.password, 10);
      const response = await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: passwordHash,
          role: data.role ?? Role.WAITER,
        },
      });
      return response;
    } catch (error) {
      handleException(error, 'Erro ao criar usuário');
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      return users;
    } catch (error) {
      handleException(error, 'Erro ao buscar usuários');
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      if (!response) {
        throw new NotFoundException({
          error: 'O usuário não foi encontrado',
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND',
        });
      }
      return response;
    } catch (error) {
      handleException(error, 'Erro ao buscar usuário');
    }
  }

  async updateUser(id: string, data: UpdateUserDto) {
    try {
      const response = await this.prismaService.user.update({
        where: { id },
        data: {
          name: data.name,
          isActive: data.isActive,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      return response;
    } catch (error) {
      handleException(error, 'Erro ao atualizar usuário');
    }
  }
  async deleteUser(id: string) {
    try {
      const response = await this.prismaService.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      return response;
    } catch (error) {
      handleException(error, 'Erro ao deletar usuário');
    }
  }

  private async ensureEmailNotExists(email: string) {
    const emailExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      throw new UnauthorizedException({
        error: 'E-mail já cadastrado.',
        message: 'E-mail já cadastrado.',
        code: 'EMAIL_EXISTS',
        field: 'email',
      });
    }
  }
}

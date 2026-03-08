import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

import { hashSync as bcryptHashSync } from 'bcrypt'
import { UserRepository } from './repository/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        createUserDto.email,
      )

      if (existingUser) {
        throw new ConflictException('Email já está em uso')
      }

      const hashedPassword = bcryptHashSync(createUserDto.password, 10)

      const user = await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
      })

      return this.removePassword(user)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }

      throw new BadRequestException('Erro ao criar usuário')
    }
  }

  async findAll(): Promise<Partial<UserEntity>[]> {
    try {
      const users = await this.userRepository.findAll()

      if (!users) {
        throw new NotFoundException('Nenhum usuário encontrado')
      }

      return users.map((user) => this.removePassword(user))
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Erro ao buscar usuários')
    }
  }

  async findOne(id: string): Promise<Partial<UserEntity>> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundException('Usuário não encontrado')
      }

      return this.removePassword(user)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Erro ao buscar usuário')
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundException('Usuário não encontrado')
      }

      if (updateUserDto.password) {
        updateUserDto.password = bcryptHashSync(updateUserDto.password, 10)
      }

      Object.assign(user, updateUserDto)

      const updatedUser = await this.userRepository.updateUser(user)

      return this.removePassword(updatedUser)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Erro ao atualizar usuário')
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundException('Usuário não encontrado')
      }

      await this.userRepository.deleteUser(user)

      return { message: 'Usuário removido com sucesso' }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Erro ao remover usuário')
    }
  }

  private removePassword(user: UserEntity): Partial<UserEntity> {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
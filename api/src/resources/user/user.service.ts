import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  HttpException,
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
        throw new ConflictException({
          message: 'Email já está em uso',
          field: 'email',
          detail: `O email ${createUserDto.email} já está cadastrado`,
        })
      }

      const hashedPassword = bcryptHashSync(createUserDto.password, 10)

      const user = await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
      })

      return this.removePassword(user)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new BadRequestException({
        message: 'Erro ao criar usuário',
        field: 'email',
        detail: 'Falha ao persistir usuário no banco de dados',
      })
    }
  }

  async findAll(): Promise<Partial<UserEntity>[]> {
    const users = await this.userRepository.findAll()

    if (users.length === 0) {
      throw new NotFoundException({
        message: 'Nenhum usuário encontrado',
        detail: 'Não existem usuários cadastrados no sistema',
      })
    }

    return users.map((user) => this.removePassword(user))
  }

  async findOne(id: string): Promise<Partial<UserEntity>> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundException({
        message: 'Usuário não encontrado',
        field: 'id',
        detail: `Usuário com id ${id} não foi encontrado`,
      })
    }

    return this.removePassword(user)
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundException({
        message: 'Usuário não encontrado',
        field: 'id',
        detail: `Não existe usuário com id ${id} para atualização`,
      })
    }

    if (updateUserDto.password) {
      updateUserDto.password = bcryptHashSync(updateUserDto.password, 10)
    }

    Object.assign(user, updateUserDto)

    const updatedUser = await this.userRepository.updateUser(user)

    return this.removePassword(updatedUser)
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundException({
          message: 'Usuário não encontrado',
          field: 'id',
          detail: `Não existe usuário com id ${id} para remoção`,
        })
      }

      await this.userRepository.deleteUser(user)

      return { message: 'Usuário removido com sucesso' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new BadRequestException({
        message: 'Erro ao remover usuário',
        detail: 'Falha ao remover usuário do banco de dados',
      })
    }
  }

  private removePassword(user: UserEntity): Partial<UserEntity> {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
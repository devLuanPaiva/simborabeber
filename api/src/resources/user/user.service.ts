import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  HttpException, ForbiddenException
} from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity, UserRole } from './entities/user.entity'
import { hashSync as bcryptHashSync } from 'bcrypt'
import { UserRepository } from './repository/user.repository'
import { JwtPayload } from '../auth/auth.service'
import { BarEntity } from '../bar/entities/bar.entity'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async create(createUserDto: CreateUserDto, actor?: JwtPayload): Promise<Partial<UserEntity>> {
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

      const userPayload: Partial<UserEntity> = {
        ...createUserDto,
        password: hashedPassword,
      }

      if (actor?.role === UserRole.MANAGER) {
        if (createUserDto.role !== UserRole.WAITER) {
          throw new ForbiddenException({ message: 'O gerente só pode criar usuários do tipo garçom', detail: 'Permissão insuficiente para criar usuário com a função solicitada' })
        }

        const manager: UserEntity | null = await this.userRepository.findUserByIdWithBar(actor.sub)

        if (!manager.bar) {
          throw new BadRequestException({ message: 'O gerente não possui bar associado', detail: 'O gerente precisa estar associado a um bar para criar usuários' })
        }

        userPayload.bar = manager.bar
      } else if (createUserDto.barId) {
        userPayload.bar = { id: createUserDto.barId } as BarEntity

      }

      const user = await this.userRepository.createUser(userPayload)

      return this.removePasswordAndBar(user)
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

  async findAll(actor?: JwtPayload): Promise<Partial<UserEntity>[]> {
    const users = await this.userRepository.findAll({ role: actor?.role as UserRole, id: actor?.sub })

    if (users.length === 0) {
      throw new NotFoundException({
        message: 'Nenhum usuário encontrado',
        detail: 'Não existem usuários cadastrados no sistema',
      })
    }

    return users.map((user) => this.removePasswordAndBar(user))
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

    return this.removePasswordAndBar(user)
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

    return this.removePasswordAndBar(updatedUser)
  }

  async toggleUserStatus(id: string): Promise<Partial<UserEntity>> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        throw new NotFoundException({
          message: 'Usuário não encontrado',
          field: 'id',
          detail: `Não existe usuário com id ${id}`,
        })
      }

      const updated = await this.userRepository.toggleUserStatus(id)

      if (!updated) {
        throw new NotFoundException({
          message: 'Usuário não encontrado',
          field: 'id',
          detail: `Não existe usuário com id ${id}`,
        })
      }

      return this.removePasswordAndBar(updated)
    } catch (error) {
      if (error instanceof HttpException) throw error

      throw new BadRequestException({
        message: 'Erro ao alternar status do usuário',
        detail: 'Falha ao persistir mudança de status no banco de dados',
      })
    }
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

  private removePasswordAndBar(user: UserEntity): Partial<UserEntity> {
    const { password, bar, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
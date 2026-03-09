import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../entities/user.entity'

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) { }

    async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        const entity = this.repository.create(user)
        return this.repository.save(entity)
    }

    async findAll(): Promise<UserEntity[]> {
        return this.repository.find()
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.repository.findOne({
            where: { email },
        })
    }

    async updateUser(user: Partial<UserEntity>): Promise<UserEntity> {
        return this.repository.save(user)
    }

    async deleteUser(user: UserEntity): Promise<void> {
        await this.repository.remove(user)
    }
}
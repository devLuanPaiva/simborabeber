import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity, UserRole } from '../entities/user.entity'

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

    async findAll(requester?: { role?: UserRole; id?: string }): Promise<UserEntity[]> {
        if (requester?.role === UserRole.MANAGER) {
            if (!requester.id) return []

            const manager = await this.repository.findOne({ where: { id: requester.id }, relations: ['bar'] })

            if (!manager.bar) return []

            return this.repository.find({
                where: {
                    role: UserRole.WAITER,
                    bar: { id: manager.bar.id },
                },
                relations: ['bar'],
            })
        }

        return this.repository.find({ relations: ['bar'] })
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async findUserByIdWithBar(id: string): Promise<UserEntity | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['bar'],
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
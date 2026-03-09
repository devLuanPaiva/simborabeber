import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';
import { BarRepository } from './repository/bar.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarEntity } from './entities/bar.entity';

@Injectable()
export class BarService {

  constructor(
    private readonly barRepository: BarRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async create(createBarDto: CreateBarDto, managerId: string): Promise<BarEntity> {
    const bar = await this.barRepository.createBar(createBarDto)

    const manager = await this.userRepository.findById(managerId)
    if (!manager) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${managerId} não foi encontrado` })
    }

    manager.bar = bar
    await this.userRepository.updateUser(manager)

    return bar
  }

  findAll(): Promise<BarEntity[]> {
    return this.barRepository.findAll();
  }

  findBySlug(slug: string): Promise<BarEntity | null> {
    return this.barRepository.findBySlug(slug);
  }

  update(id: string, updateBarDto: UpdateBarDto): Promise<BarEntity> {
    return this.barRepository.updateBar({ ...updateBarDto, id });
  }

  remove(id: string) {
    return this.barRepository.deleteBar({ id } as BarEntity);
  }
}

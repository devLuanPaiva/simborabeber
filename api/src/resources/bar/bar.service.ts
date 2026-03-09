import { Injectable } from '@nestjs/common';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';
import { BarRepository } from './repository/bar.repository';
import { BarEntity } from './entities/bar.entity';

@Injectable()
export class BarService {

  constructor(private readonly barRepository: BarRepository) { }

  create(createBarDto: CreateBarDto): Promise<BarEntity> {
    return this.barRepository.createBar(createBarDto);
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

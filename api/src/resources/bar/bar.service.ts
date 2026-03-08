import { Injectable } from '@nestjs/common';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';

@Injectable()
export class BarService {
  create(createBarDto: CreateBarDto) {
    return 'This action adds a new bar';
  }

  findAll() {
    return `This action returns all bar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bar`;
  }

  update(id: number, updateBarDto: UpdateBarDto) {
    return `This action updates a #${id} bar`;
  }

  remove(id: number) {
    return `This action removes a #${id} bar`;
  }
}

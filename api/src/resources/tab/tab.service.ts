import { Injectable } from '@nestjs/common';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';

@Injectable()
export class TabService {
  create(createTabDto: CreateTabDto) {
    return 'This action adds a new tab';
  }

  findAll() {
    return `This action returns all tab`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tab`;
  }

  update(id: number, updateTabDto: UpdateTabDto) {
    return `This action updates a #${id} tab`;
  }

  remove(id: number) {
    return `This action removes a #${id} tab`;
  }
}

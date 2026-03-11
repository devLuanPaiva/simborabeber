import { Injectable } from '@nestjs/common';
import { CreateTabItemDto } from './dto/create-tab-item.dto';
import { UpdateTabItemDto } from './dto/update-tab-item.dto';

@Injectable()
export class TabItemService {
  create(createTabItemDto: CreateTabItemDto) {
    return 'This action adds a new tabItem';
  }

  findAll() {
    return `This action returns all tabItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tabItem`;
  }

  update(id: number, updateTabItemDto: UpdateTabItemDto) {
    return `This action updates a #${id} tabItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} tabItem`;
  }
}

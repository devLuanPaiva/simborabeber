import { Injectable } from '@nestjs/common';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { TabRepository } from './repository/tab.repository';

@Injectable()
export class TabService {

  constructor(
    private readonly tabRepository: TabRepository,

  ) { }
  create(createTabDto: CreateTabDto) {
    return this.tabRepository.createTab(createTabDto);
  }

  closeTab(tabId: string) {
    return this.tabRepository.closeTab(tabId);
  }

  findThemAllByBarSlug(slug: string) {
    return this.tabRepository.findThemAllByBarSlug(slug);
  }

  findOne(id: string) {
    return this.tabRepository.findById(id);
  }

  update(id: string, updateTabDto: UpdateTabDto) {
    return this.tabRepository.updateTab({ ...updateTabDto, id });
  }

  remove(id: string) {
    return this.tabRepository.deleteTab(id);
  }
}

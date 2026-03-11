import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { TabRepository } from './repository/tab.repository';
import { TabEntity } from './entities/tab.entity';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class TabService {

  constructor(
    private readonly tabRepository: TabRepository,
    private readonly userRepository: UserRepository,

  ) { }
  async create(createTabDto: CreateTabDto, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    if (!user.bar) {
      throw new ForbiddenException({ message: 'Usuário não possui bar associado', field: 'bar', detail: `O usuário não possui um bar associado e não pode criar comandas` })
    }

    const tabData: Partial<TabEntity> = {
      ...createTabDto,
      waiterOpen: user,
      bar: user.bar,
    }

    return this.tabRepository.createTab(tabData);
  }

  async closeTab(tabId: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    return this.tabRepository.closeTab(tabId, user);
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

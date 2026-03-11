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
    const user = await this.userRepository.findUserByIdWithBar(userId);
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

    const created = await this.tabRepository.createTab(tabData);
    return this.shapeTab(created);
  }

  async closeTab(tabId: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    const closed = await this.tabRepository.closeTab(tabId, user);
    return this.shapeTab(closed);
  }

  findThemAllByBarSlug(slug: string) {
    return this.tabRepository.findThemAllByBarSlug(slug);
  }

  findOne(id: string) {
    return this.tabRepository.findById(id);
  }

  async update(id: string, updateTabDto: UpdateTabDto) {
    const updated = await this.tabRepository.updateTab({ ...updateTabDto, id });
    return this.shapeTab(updated);
  }

  remove(id: string) {
    return this.tabRepository.deleteTab(id);
  }

  private shapeTab(tab: TabEntity | Partial<TabEntity> | null) {
    if (!tab) return null;

    const waiterOpen = (tab).waiterOpen ? { id: (tab).waiterOpen.id, name: (tab).waiterOpen.name } : undefined;
    const waiterClosed = (tab).waiterClosed ? { id: (tab).waiterClosed.id, name: (tab).waiterClosed.name } : undefined;

    return {
      id: (tab).id,
      status: (tab).status,
      tableNumber: (tab).tableNumber,
      customerName: (tab).customerName,
      totalValue: (tab).totalValue,
      createdAt: (tab).createdAt,
      updatedAt: (tab).updatedAt,
      closedAt: (tab).closedAt,
      waiterOpen,
      waiterClosed,
    } as Partial<TabEntity>;
  }
}

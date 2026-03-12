import { Injectable } from '@nestjs/common';
import { CreateTabItemDto } from './dto/create-tab-item.dto';
import { TabItemsRepository } from './repository/tab-item.repository';

@Injectable()
export class TabItemService {

  constructor(private readonly tabItemRepository: TabItemsRepository) { }

  createItemByTab(tabId: string, createTabItemDto: CreateTabItemDto, userId: string) {
    return this.tabItemRepository.createItemByTab(tabId, createTabItemDto, userId);
  }

  findItemsByTab(tabId: string) {
    return this.tabItemRepository.findItemsByTab(tabId);
  }

  updateItemQuantity(id: string, quantity: number) {
    return this.tabItemRepository.updateItemQuantity(id, quantity);
  }

  deleteItem(id: string) {
    return this.tabItemRepository.deleteItem(id);
  }
}

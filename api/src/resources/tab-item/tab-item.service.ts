import { Injectable } from '@nestjs/common';
import { CreateTabItemDto } from './dto/create-tab-item.dto';
import { TabItemsRepository } from './repository/tab-item.repository';
import { TabItemGateway } from './tab-item.gateway';

@Injectable()
export class TabItemService {

  constructor(
    private readonly tabItemRepository: TabItemsRepository,
    private readonly tabItemGateway: TabItemGateway,
  ) { }

  async createItemByTab(tabId: string, createTabItemDto: CreateTabItemDto, userId: string) {
    const created = await this.tabItemRepository.createItemByTab(tabId, createTabItemDto, userId);
    await this.tabItemGateway.notifyItemAdded(tabId, created);
    return created;
  }

  async findItemsByTab(tabId: string) {
    return this.tabItemRepository.findItemsByTab(tabId);
  }

  async updateItemQuantity(id: string, quantity: number) {
    const updated = await this.tabItemRepository.updateItemQuantity(id, quantity);
    const tabId = updated.tab?.id;
    if (tabId) await this.tabItemGateway.notifyItemUpdated(tabId, updated);
    return updated;
  }

  async deleteItem(id: string) {
    const item = await this.tabItemRepository.findByIdWithTab(id);
    const tabId = item?.tab?.id;
    await this.tabItemRepository.deleteItem(id);
    if (tabId) await this.tabItemGateway.notifyItemDeleted(tabId, id);
    return { message: 'Item removed' };
  }
}

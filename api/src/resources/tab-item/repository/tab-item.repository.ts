import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TabItemEntity } from "../entities/tab-item.entity";
import { Repository } from "typeorm";
import { TabEntity } from "../../tab/entities/tab.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class TabItemsRepository {
    constructor(
        @InjectRepository(TabItemEntity)
        private readonly repository: Repository<TabItemEntity>,
    ) { }


    async createItemByTab(tabId: string, itemData: Partial<TabItemEntity>, userId: string): Promise<TabItemEntity> {
        return this.repository.manager.transaction(async manager => {
            const tabRepo = manager.getRepository(TabEntity);
            const tab = await tabRepo.findOne({ where: { id: tabId } });
            if (!tab) {
                throw new NotFoundException({ message: 'Comanda não encontrada', field: 'tabId', detail: `Comanda com id ${tabId} não foi encontrada` });
            }

            const user = new UserEntity();
            user.id = userId;

            const itemRepo = manager.getRepository(TabItemEntity);
            const item = itemRepo.create({ ...itemData, tab, waiterAdded: user });
            const saved = await itemRepo.save(item);

            const addedValue = Number(saved.price) * Number(saved.quantity);
            tab.totalValue = Number(tab.totalValue || 0) + addedValue;
            await tabRepo.save(tab);

            return saved;
        });
    }

    async findItemsByTab(tabId: string): Promise<TabItemEntity[]> {
        return this.repository.find({ where: { tab: { id: tabId } }, relations: ['waiterAdded', 'tab'] });
    }

    async findByIdWithTab(id: string): Promise<TabItemEntity | null> {
        return this.repository.findOne({ where: { id }, relations: ['tab'] });
    }

    async updateItemQuantity(id: string, quantity: number): Promise<TabItemEntity> {
        return this.repository.manager.transaction(async manager => {
            const itemRepo = manager.getRepository(TabItemEntity);
            const tabRepo = manager.getRepository(TabEntity);

            const item = await itemRepo.findOne({ where: { id }, relations: ['tab'] });
            if (!item) {
                throw new NotFoundException({ message: 'Item não encontrado', field: 'id', detail: `Item com id ${id} não foi encontrado` });
            }

            const oldQuantity = Number(item.quantity);
            item.quantity = quantity;
            const savedItem = await itemRepo.save(item);

            const diff = (Number(quantity) - oldQuantity) * Number(item.price);
            const tab = item.tab;
            tab.totalValue = Number(tab.totalValue || 0) + diff;
            await tabRepo.save(tab);

            return savedItem;
        });
    }

    async deleteItem(id: string): Promise<void> {
        return this.repository.manager.transaction(async manager => {
            const itemRepo = manager.getRepository(TabItemEntity);
            const tabRepo = manager.getRepository(TabEntity);

            const item = await itemRepo.findOne({ where: { id }, relations: ['tab'] });
            if (!item) {
                throw new NotFoundException({ message: 'Item não encontrado', field: 'id', detail: `Item com id ${id} não foi encontrado` });
            }

            const tab = item.tab;
            const subtract = Number(item.price) * Number(item.quantity);
            tab.totalValue = Math.max(0, Number(tab.totalValue || 0) - subtract);
            await tabRepo.save(tab);

            await itemRepo.delete(id);
        });
    }
}
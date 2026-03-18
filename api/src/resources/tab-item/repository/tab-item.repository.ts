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

    async createItemsByTab(tabId: string, itemsData: Partial<TabItemEntity>[], userId: string): Promise<TabItemEntity[]> {
        return this.repository.manager.transaction(async manager => {
            const tabRepo = manager.getRepository(TabEntity);
            const tab = await tabRepo.findOne({ where: { id: tabId } });
            if (!tab) {
                throw new NotFoundException({ message: 'Comanda não encontrada', field: 'tabId', detail: `Comanda com id ${tabId} não foi encontrada` });
            }

            const user = new UserEntity();
            user.id = userId;

            const itemRepo = manager.getRepository(TabItemEntity);

            const itemsToCreate = itemsData.map(d => ({ ...d, tab, waiterAdded: user }));
            const created = itemRepo.create(itemsToCreate as any[]);
            const saved = await itemRepo.save(created);

            const addedValue = saved.reduce((acc, it) => acc + (Number(it.price) * Number(it.quantity)), 0);
            tab.totalValue = Number(tab.totalValue || 0) + addedValue;
            await tabRepo.save(tab);

            return saved;
        });
    }

    async findItemsByTab(tabId: string): Promise<TabItemEntity[]> {
        const rows = await this.repository.createQueryBuilder('item')
            .innerJoin('item.tab', 'tab', 'tab.id = :tabId', { tabId })
            .leftJoin('item.waiterAdded', 'waiterAdded')
            .select([
                'item.id as id',
                'item.name as name',
                'item.price as price',
                'item.quantity as quantity',
                'item.created_at as createdAt',
                'item.updated_at as updatedAt',
                'waiterAdded.id as "waiterAddedId"',
                'waiterAdded.name as "waiterAddedName"',
            ])
            .getRawMany();

        return rows.map((r) => {
            const item = new TabItemEntity();
            item.id = r.id;
            item.name = r.name;
            item.price = Number.parseFloat(r.price)
            item.quantity = typeof r.quantity === 'string' ? Number.parseInt(r.quantity) : r.quantity;
            item.createdAt = r.createdAt ? new Date(r.createdAt) : undefined;
            item.updatedAt = r.updatedAt ? new Date(r.updatedAt) : undefined;
            item.waiterAdded = r.waiterAddedId ? ({ id: r.waiterAddedId, name: r.waiterAddedName } as UserEntity) : undefined;
            return item;
        });

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
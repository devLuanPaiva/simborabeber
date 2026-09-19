import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TabItemEntity } from "../entities/tab-item.entity";
import { TabEntity, TabStatus } from "../../tab/entities/tab.entity";
import { EntityManager, Repository } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class TabItemsRepository {
    constructor(
        @InjectRepository(TabItemEntity)
        private readonly repository: Repository<TabItemEntity>,
    ) { }

    private mapTabItemEntity(item: TabItemEntity, waiterAdded?: UserEntity): TabItemEntity {
        const result = new TabItemEntity();
        result.id = item.id;
        result.name = item.name;
        result.price = typeof item.price === 'string' ? Number.parseFloat(item.price) : item.price;
        result.quantity = typeof item.quantity === 'string' ? Number.parseInt(item.quantity) : item.quantity;
        result.notes = item.notes;
        result.category = item.category;
        result.createdAt = item.createdAt;
        result.updatedAt = item.updatedAt;
        result.waiterAdded = waiterAdded || (item.waiterAdded ? { id: item.waiterAdded.id, name: item.waiterAdded.name } as UserEntity : undefined);
        result.components = (item.components ?? []).map((c) => ({
            ...c,
            price: typeof c.price === 'string' ? Number.parseFloat(c.price) : c.price,
        }));
        result.addons = (item.addons ?? []).map((a) => ({
            ...a,
            price: typeof a.price === 'string' ? Number.parseFloat(a.price) : a.price,
        }));
        return result;
    }

    private findHydratedById(manager: EntityManager, id: string): Promise<TabItemEntity | null> {
        return manager.getRepository(TabItemEntity).createQueryBuilder('item')
            .leftJoin('item.waiterAdded', 'waiterAdded')
            .addSelect(['waiterAdded.id', 'waiterAdded.name'])
            .leftJoinAndSelect('item.components', 'components')
            .leftJoinAndSelect('item.addons', 'addons')
            .where('item.id = :id', { id })
            .getOne();
    }

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

            const hydrated = await this.findHydratedById(manager, saved.id);
            return this.mapTabItemEntity(hydrated as TabItemEntity);
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

            const hydrated = await Promise.all(saved.map((s) => this.findHydratedById(manager, s.id)));
            return hydrated.map((h) => this.mapTabItemEntity(h as TabItemEntity));
        });
    }

    async findItemsByTab(tabId: string): Promise<TabItemEntity[]> {
        const items = await this.repository.createQueryBuilder('item')
            .innerJoin('item.tab', 'tab', 'tab.id = :tabId', { tabId })
            .leftJoin('item.waiterAdded', 'waiterAdded')
            .addSelect(['waiterAdded.id', 'waiterAdded.name'])
            .leftJoinAndSelect('item.components', 'components')
            .leftJoinAndSelect('item.addons', 'addons')
            .orderBy("LOWER(unaccent(item.name))", 'ASC')
            .addOrderBy('item.created_at', 'DESC')
            .getMany();

        return items.map((item) => this.mapTabItemEntity(item));
    }

    async findItemsByBarSlug(barSlug: string): Promise<TabItemEntity[]> {
        const items = await this.repository.createQueryBuilder('item')
            .innerJoin('item.tab', 'tab')
            .innerJoin('tab.bar', 'bar', 'bar.slug = :slug', { slug: barSlug })
            .leftJoin('item.waiterAdded', 'waiterAdded')
            .addSelect(['waiterAdded.id', 'waiterAdded.name'])
            .leftJoinAndSelect('item.components', 'components')
            .leftJoinAndSelect('item.addons', 'addons')
            .where('tab.status = :closed', { closed: TabStatus.CLOSED })
            .orderBy("LOWER(unaccent(item.name))", 'ASC')
            .addOrderBy('item.created_at', 'DESC')
            .getMany();

        return items.map((item) => this.mapTabItemEntity(item));
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

            const hydrated = await this.findHydratedById(manager, savedItem.id);
            return this.mapTabItemEntity(hydrated as TabItemEntity);
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

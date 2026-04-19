import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TabEntity, TabStatus } from "../entities/tab.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class TabRepository {
    constructor(
        @InjectRepository(TabEntity)
        private readonly repository: Repository<TabEntity>,
    ) { }

    private mapTabEntity(tab: TabEntity, waiterOpen?: UserEntity, waiterClosed?: UserEntity): TabEntity {
        const result = new TabEntity();
        result.id = tab.id;
        result.status = tab.status;
        result.tableNumber = tab.tableNumber;
        result.customerName = tab.customerName;
        result.totalValue = typeof tab.totalValue === 'string' ? Number.parseFloat(tab.totalValue) : tab.totalValue;
        result.createdAt = tab.createdAt;
        result.updatedAt = tab.updatedAt;
        result.closedAt = tab.closedAt;
        result.waiterOpen = waiterOpen || (tab.waiterOpen ? { id: tab.waiterOpen.id, name: tab.waiterOpen.name } as UserEntity : undefined);
        result.waiterClosed = waiterClosed || (tab.waiterClosed ? { id: tab.waiterClosed.id, name: tab.waiterClosed.name } as UserEntity : undefined);
        return result;
    }

    async createTab(tab: Partial<TabEntity>): Promise<TabEntity> {
        const entity = this.repository.create(tab)
        const saved = await this.repository.save(entity)
        return this.mapTabEntity(saved)
    }

    async closeTab(tabId: string, waiterClosed: UserEntity): Promise<TabEntity> {
        const tab = await this.repository.findOne({ where: { id: tabId } });
        if (!tab) {
            throw new NotFoundException({ message: "Comanda não encontrada", details: "Nenhuma comanda encontrada com o ID fornecido." });
        }
        tab.status = TabStatus.CLOSED
        tab.closedAt = new Date();
        tab.waiterClosed = waiterClosed;
        const saved = await this.repository.save(tab);
        return this.mapTabEntity(saved);
    }

    async findThemAllByBarSlug(bar_slug: string): Promise<Partial<TabEntity[]>> {
        const rows = await this.repository.createQueryBuilder('tab')
            .innerJoin('tab.bar', 'bar', 'bar.slug = :slug', { slug: bar_slug })
            .leftJoin('tab.waiterOpen', 'waiterOpen')
            .leftJoin('tab.waiterClosed', 'waiterClosed')
            .select([
                'tab.id as id',
                'tab.status as status',
                'tab.table_number as "tableNumber"',
                'tab.customer_name as "customerName"',
                'tab.total_value as "totalValue"',
                'tab.created_at as "createdAt"',
                'tab.updated_at as "updatedAt"',
                'tab.closed_at as "closedAt"',
                'waiterOpen.id as "waiterOpenId"',
                'waiterOpen.name as "waiterOpenName"',
                'waiterClosed.id as "waiterClosedId"',
                'waiterClosed.name as "waiterClosedName"',
            ])

            .orderBy('(tab.status = :open)', 'DESC')
            .addOrderBy('CASE WHEN tab.status = :open THEN tab.created_at ELSE tab.closed_at END', 'DESC')
            .setParameter('open', TabStatus.OPEN)
            .getRawMany();

        return rows.map((r) => this.mapTabEntity(r, r.waiterOpenId ? { id: r.waiterOpenId, name: r.waiterOpenName } as UserEntity : undefined, r.waiterClosedId ? { id: r.waiterClosedId, name: r.waiterClosedName } as UserEntity : undefined));
    }

    async findById(id: string): Promise<TabEntity | null> {
        const response = await this.repository.createQueryBuilder('tab')
            .leftJoin('tab.waiterOpen', 'waiterOpen')
            .leftJoin('tab.waiterClosed', 'waiterClosed')
            .select([
                'tab.id as id',
                'tab.status as status',
                'tab.table_number as "tableNumber"',
                'tab.customer_name as "customerName"',
                'tab.total_value as "totalValue"',
                'tab.created_at as "createdAt"',
                'tab.updated_at as "updatedAt"',
                'tab.closed_at as "closedAt"',
                'waiterOpen.id as "waiterOpenId"',
                'waiterOpen.name as "waiterOpenName"',
                'waiterClosed.id as "waiterClosedId"',
                'waiterClosed.name as "waiterClosedName"',
            ])
            .where('tab.id = :id', { id })
            .getRawOne();

        if (!response) return null;

        const tab = this.mapTabEntity(response, response.waiterOpenId ? { id: response.waiterOpenId, name: response.waiterOpenName } as UserEntity : undefined, response.waiterClosedId ? { id: response.waiterClosedId, name: response.waiterClosedName } as UserEntity : undefined);
        return tab;

    }

    async findByIdWithBar(id: string): Promise<TabEntity | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['bar'],
        })
    }

    async updateTab(tab: Partial<TabEntity>): Promise<TabEntity> {
        const saved = await this.repository.save(tab);
        return this.mapTabEntity(saved);
    }

    async deleteTab(tab_id: string): Promise<void> {
        await this.repository.delete(tab_id);
    }
}
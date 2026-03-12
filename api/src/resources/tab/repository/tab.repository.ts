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

    async createTab(tab: Partial<TabEntity>): Promise<TabEntity> {
        const entity = this.repository.create(tab)
        return this.repository.save(entity)
    }

    async closeTab(tabId: string, waiterClosed: UserEntity): Promise<TabEntity> {
        const tab = await this.repository.findOne({ where: { id: tabId } });
        if (!tab) {
            throw new NotFoundException({ message: "Comanda não encontrada", details: "Nenhuma comanda encontrada com o ID fornecido." });
        }
        tab.status = TabStatus.CLOSED
        tab.closedAt = new Date();
        tab.waiterClosed = waiterClosed;
        return this.repository.save(tab);
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
            .orderBy('tab.created_at', 'DESC')
            .getRawMany();

        return rows.map((r) => {
            const t = new TabEntity();
            t.id = r.id;
            t.status = r.status;
            t.tableNumber = r.tableNumber;
            t.customerName = r.customerName;
            t.totalValue = typeof r.totalValue === 'string' ? Number.parseFloat(r.totalValue) : r.totalValue;
            t.createdAt = r.createdAt ? new Date(r.createdAt) : undefined;
            t.updatedAt = r.updatedAt ? new Date(r.updatedAt) : undefined;
            t.closedAt = r.closedAt ? new Date(r.closedAt) : undefined;
            t.waiterOpen = r.waiterOpenId ? ({ id: r.waiterOpenId, name: r.waiterOpenName } as UserEntity) : undefined;
            t.waiterClosed = r.waiterClosedId ? ({ id: r.waiterClosedId, name: r.waiterClosedName } as UserEntity) : undefined;
            return t;
        });
    }

    async findById(id: string): Promise<TabEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async findByIdWithBar(id: string): Promise<TabEntity | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['bar'],
        })
    }
    async updateTab(tab: Partial<TabEntity>): Promise<TabEntity> {
        return this.repository.save(tab)
    }

    async deleteTab(tab_id: string): Promise<void> {
        await this.repository.delete(tab_id);
    }
}
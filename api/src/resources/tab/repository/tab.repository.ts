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
            .select([
                'tab.id as id',
                'tab.status as status',
                'tab.tableNumber as "tableNumber"',
                'tab.customerName as "customerName"',
                'tab.totalValue as "totalValue"',
                'tab.createdAt as "createdAt"',
                'tab.updatedAt as "updatedAt"',
                'tab.closedAt as "closedAt"',
                'waiterOpen as "waiterOpen"',
                'waiterClosed as "waiterClosed"',
            ])
            .orderBy('tab.created_at', 'DESC')
            .getRawMany();

        return rows.map((r) => {
            const t = new TabEntity()
            t.id = r.id;
            t.status = r.status;
            t.tableNumber = r.tableNumber;
            t.customerName = r.customerName;
            t.totalValue = typeof r.totalValue === 'string' ? Number.parseFloat(r.totalValue) : r.totalValue;
            t.createdAt = r.createdAt;
            t.updatedAt = r.updatedAt;
            t.closedAt = r.closedAt;
            t.waiterClosed = r.waiterClosed;
            t.waiterOpen = r.waiterOpen;
            return t;
        })

    }

    async findById(id: string): Promise<TabEntity | null> {
        return this.repository.findOne({
            where: { id },
        })
    }

    async updateTab(tab: Partial<TabEntity>): Promise<TabEntity> {
        return this.repository.save(tab)
    }

    async deleteTab(tab_id: string): Promise<void> {
        await this.repository.delete(tab_id);
    }
}
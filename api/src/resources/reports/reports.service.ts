import { Injectable, NotFoundException } from '@nestjs/common';
import { TabRepository } from '../tab/repository/tab.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { TabStatus, TabEntity } from '../tab/entities/tab.entity';
import { SalesIndicatorsDto } from './dto/sales-indicators.dto';

@Injectable()
export class ReportsService {
    constructor(
        private readonly tabRepository: TabRepository,
        private readonly barRepository: BarRepository,
    ) { }

   
    async calculateSalesIndicators(slug: string): Promise<SalesIndicatorsDto> {
        const bar = await this.barRepository.findBySlug(slug);
        
        if (!bar) {
            throw new NotFoundException({
                message: 'Bar não encontrado',
                details: `Nenhum bar foi encontrado com o slug "${slug}".`
            });
        }

        const tabs = await this.tabRepository.findThemAllByBarSlug(slug);
        const closedTabs = this.filterClosedTabs(tabs);
        const openedTabs = this.filterOpenTabs(tabs);

        const totalRevenue = this.calculateTotalRevenue(closedTabs);
        const todayRevenue = this.calculateTodayRevenue(closedTabs);
        const closedTabsCount = closedTabs.length;
        const openedTabsCount = openedTabs.length;
        const averageTicketValue = this.calculateAverageTicketValue(totalRevenue, closedTabsCount);

        return {
            totalRevenue,
            todayRevenue,
            averageTicketValue,
            closedTabsCount,
            openedTabsCount,
        };
    }

   
    private filterClosedTabs(tabs: TabEntity[]): TabEntity[] {
        return tabs.filter((tab) => tab.status === TabStatus.CLOSED);
    }

    private filterOpenTabs(tabs: TabEntity[]): TabEntity[] {
        return tabs.filter((tab) => tab.status === TabStatus.OPEN);
    }

    
    private calculateTotalRevenue(closedTabs: TabEntity[]): number {
        return closedTabs.reduce((sum, tab) => {
            const value = typeof tab.totalValue === 'string' 
                ? Number.parseFloat(tab.totalValue) 
                : tab.totalValue;
            return sum + value;
        }, 0);
    }

    
    private calculateTodayRevenue(closedTabs: TabEntity[]): number {
        const today = this.getStartOfDay(new Date());

        return closedTabs.reduce((sum, tab) => {
            if (!tab.closedAt) {
                return sum;
            }

            const closedDate = this.getStartOfDay(new Date(tab.closedAt));

            if (closedDate.getTime() === today.getTime()) {
                const value = typeof tab.totalValue === 'string' 
                    ? Number.parseFloat(tab.totalValue) 
                    : tab.totalValue;
                return sum + value;
            }

            return sum;
        }, 0);
    }

    private calculateAverageTicketValue(totalRevenue: number, closedTabsCount: number): number {
        if (closedTabsCount === 0) {
            return 0;
        }

        return Number((totalRevenue / closedTabsCount).toFixed(2));
    }

    private getStartOfDay(date: Date): Date {
        const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        brazilDate.setUTCHours(0, 0, 0, 0);
        return brazilDate;
    }
}

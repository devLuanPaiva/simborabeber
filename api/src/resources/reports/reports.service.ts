import { Injectable, NotFoundException } from '@nestjs/common';
import { TabRepository } from '../tab/repository/tab.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { SalesIndicatorsDto } from './dto/sales-indicators.dto';
import { WeeklySalesComparisonDto } from './dto/weekly-sales-comparison.dto';
import { filterClosedTabs, calculateAverageTicketValue, calculateTodayRevenue, calculateTotalRevenue, filterOpenTabs, calculateWeeklySalesData } from './utils/reports.utils';

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
        const closedTabs = filterClosedTabs(tabs);
        const openedTabs = filterOpenTabs(tabs);

        const totalRevenue = calculateTotalRevenue(closedTabs);
        const todayRevenue = calculateTodayRevenue(closedTabs);
        const closedTabsCount = closedTabs.length;
        const openedTabsCount = openedTabs.length;
        const averageTicketValue = calculateAverageTicketValue(totalRevenue, closedTabsCount);

        return {
            totalRevenue,
            todayRevenue,
            averageTicketValue,
            closedTabsCount,
            openedTabsCount,
        };
    }

 
    async calculateWeeklySalesComparison(slug: string): Promise<WeeklySalesComparisonDto> {
        const bar = await this.barRepository.findBySlug(slug);

        if (!bar) {
            throw new NotFoundException({
                message: 'Bar não encontrado',
                details: `Nenhum bar foi encontrado com o slug "${slug}".`
            });
        }

        const tabs = await this.tabRepository.findThemAllByBarSlug(slug);
        const closedTabs = filterClosedTabs(tabs);
        const weeklySalesData = calculateWeeklySalesData(closedTabs);

        return {
            days: weeklySalesData,
        };
    }
}

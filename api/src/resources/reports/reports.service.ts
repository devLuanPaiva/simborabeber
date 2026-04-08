import { Injectable, NotFoundException } from '@nestjs/common';
import { TabRepository } from '../tab/repository/tab.repository';
import { BarRepository } from '../bar/repository/bar.repository';
import { TabItemsRepository } from '../tab-item/repository/tab-item.repository';
import { ProductCategory } from '../product/entities/product.entity';
import { SalesIndicatorsDto } from './dto/sales-indicators.dto';
import { filterClosedTabs, calculateAverageTicketValue, calculateTodayRevenue, calculateTotalRevenue, filterOpenTabs, calculateWeeklySalesData, calculateMonthlyWeeklySalesData, calculateLastNMonthsSalesData, CategoryComparisonItem } from './utils/reports.utils';
import { MonthlyWeeklyComparisonDto, WeeklySalesComparisonDto, LastMonthsComparisonDto } from './dto/weekly-sales-comparison.dto';

@Injectable()
export class ReportsService {
    constructor(
        private readonly tabRepository: TabRepository,
        private readonly barRepository: BarRepository,
        private readonly tabItemsRepository: TabItemsRepository,
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


    async calculateMonthlyWeeklyComparison(slug: string): Promise<MonthlyWeeklyComparisonDto> {
        const bar = await this.barRepository.findBySlug(slug);

        if (!bar) {
            throw new NotFoundException({
                message: 'Bar não encontrado',
                details: `Nenhum bar foi encontrado com o slug "${slug}".`
            });
        }

        const tabs = await this.tabRepository.findThemAllByBarSlug(slug);
        const closedTabs = filterClosedTabs(tabs);

        const now = new Date();
        const brazilNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const year = brazilNow.getUTCFullYear();
        const month = brazilNow.getUTCMonth();

        const monthlyWeeklyData = calculateMonthlyWeeklySalesData(closedTabs, year, month);

        return {
            weeks: monthlyWeeklyData,
        };
    }


    async calculateLastSixMonthsComparison(slug: string): Promise<LastMonthsComparisonDto> {
        const bar = await this.barRepository.findBySlug(slug);

        if (!bar) {
            throw new NotFoundException({
                message: 'Bar não encontrado',
                details: `Nenhum bar foi encontrado com o slug "${slug}".`
            });
        }

        const tabs = await this.tabRepository.findThemAllByBarSlug(slug);
        const closedTabs = filterClosedTabs(tabs);

        const now = new Date();
        const brazilNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

        const monthsData = calculateLastNMonthsSalesData(closedTabs, brazilNow, 6);

        return {
            months: monthsData,
        };
    }

    async calculateCategoriesComparison(slug: string): Promise<{ categories: CategoryComparisonItem[] }> {
        const bar = await this.barRepository.findBySlug(slug);

        if (!bar) {
            throw new NotFoundException({
                message: 'Bar não encontrado',
                details: `Nenhum bar foi encontrado com o slug "${slug}".`
            });
        }

        const items = await this.tabItemsRepository.findItemsByBarSlug(slug);

        const totalRevenue = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);

        const categories: CategoryComparisonItem[] = Object.values(ProductCategory).map((cat) => {
            const catItems = items.filter(i => i.category === cat);
            const catRevenue = catItems.reduce((s, it) => s + (Number(it.price) * Number(it.quantity)), 0);
            const catCount = catItems.reduce((s, it) => s + Number(it.quantity), 0);

            const percentage = totalRevenue === 0 ? 0 : Number(((catRevenue / totalRevenue) * 100).toFixed(2));

            return {
                category: cat as ProductCategory,
                totalRevenue: Number(catRevenue.toFixed(2)),
                totalCount: catCount,
                percentage,
            } as CategoryComparisonItem;
        });

        return { categories };
    }
}


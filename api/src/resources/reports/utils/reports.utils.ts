import { TabEntity, TabStatus } from "src/resources/tab/entities/tab.entity";
import { DayOfWeekSalesDto } from "../dto/weekly-sales-comparison.dto";

export const filterClosedTabs = (tabs: TabEntity[]): TabEntity[] => {
    return tabs.filter((tab) => tab.status === TabStatus.CLOSED);
}

export const filterOpenTabs = (tabs: TabEntity[]): TabEntity[] => {
    return tabs.filter((tab) => tab.status === TabStatus.OPEN);
}


export const calculateTotalRevenue = (closedTabs: TabEntity[]): number => {
    return closedTabs.reduce((sum, tab) => {
        const value = typeof tab.totalValue === 'string'
            ? Number.parseFloat(tab.totalValue)
            : tab.totalValue;
        return sum + value;
    }, 0);
}


export const calculateTodayRevenue = (closedTabs: TabEntity[]): number => {
    const today = getStartOfDay(new Date());

    return closedTabs.reduce((sum, tab) => {
        if (!tab.closedAt) {
            return sum;
        }

        const closedDate = getStartOfDay(new Date(tab.closedAt));

        if (closedDate.getTime() === today.getTime()) {
            const value = typeof tab.totalValue === 'string'
                ? Number.parseFloat(tab.totalValue)
                : tab.totalValue;
            return sum + value;
        }

        return sum;
    }, 0);
}

export const calculateAverageTicketValue = (totalRevenue: number, closedTabsCount: number): number => {
    if (closedTabsCount === 0) {
        return 0;
    }

    return Number((totalRevenue / closedTabsCount).toFixed(2));
}

export const getStartOfDay = (date: Date): Date => {
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    brazilDate.setUTCHours(0, 0, 0, 0);
    return brazilDate;
}


export const getWeekDayNumber = (date: Date): number => {
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return brazilDate.getUTCDay();
}


export const getWeekDayName = (dayNumber: number): string => {
    const daysInPortuguese: Record<number, string> = {
        0: 'Domingo',
        1: 'Segunda-feira',
        2: 'Terça-feira',
        3: 'Quarta-feira',
        4: 'Quinta-feira',
        5: 'Sexta-feira',
        6: 'Sábado',
    };
    return daysInPortuguese[dayNumber] || '';
}


export const filterTabsByDayOfWeek = (closedTabs: TabEntity[], dayNumber: number): TabEntity[] => {
    return closedTabs.filter((tab) => {
        if (!tab.closedAt) {
            return false;
        }
        return getWeekDayNumber(new Date(tab.closedAt)) === dayNumber;
    });
}


export const calculateWeeklySalesData = (closedTabs: TabEntity[]): DayOfWeekSalesDto[] => {
    const weeklySalesData: DayOfWeekSalesDto[] = [];

    for (let dayNumber = 0; dayNumber < 7; dayNumber++) {
        const dayTabs = filterTabsByDayOfWeek(closedTabs, dayNumber);
        const dayRevenue = calculateTotalRevenue(dayTabs);
        const dayTabsCount = dayTabs.length;

        weeklySalesData.push({
            dayOfWeek: getWeekDayName(dayNumber),
            dayNumber,
            totalRevenue: dayRevenue,
            closedTabsCount: dayTabsCount,
        });
    }

    return weeklySalesData;
}
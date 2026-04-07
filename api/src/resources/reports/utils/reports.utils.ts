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


export const getWeekOfMonthNumber = (date: Date): number => {
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const dayOfMonth = brazilDate.getUTCDate();
    return Math.ceil(dayOfMonth / 7);
}


export const filterTabsByWeekOfMonth = (closedTabs: TabEntity[], weekNumber: number, year: number, month: number): TabEntity[] => {
    return closedTabs.filter((tab) => {
        if (!tab.closedAt) {
            return false;
        }

        const closedDate = new Date(tab.closedAt);
        const brazilDate = new Date(closedDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const closedYear = brazilDate.getUTCFullYear();
        const closedMonth = brazilDate.getUTCMonth();

        if (closedYear !== year || closedMonth !== month) {
            return false;
        }

        return getWeekOfMonthNumber(new Date(tab.closedAt)) === weekNumber;
    });
}


export const calculateMonthlyWeeklySalesData = (closedTabs: TabEntity[], year: number, month: number) => {
    const monthlyData = [] as Array<{
        weekLabel: string;
        weekNumber: number;
        totalRevenue: number;
        closedTabsCount: number;
    }>;

    for (let week = 1; week <= 5; week++) {
        const weekTabs = filterTabsByWeekOfMonth(closedTabs, week, year, month);
        const weekRevenue = calculateTotalRevenue(weekTabs);
        const weekTabsCount = weekTabs.length;

        monthlyData.push({
            weekLabel: `Semana ${week}`,
            weekNumber: week,
            totalRevenue: weekRevenue,
            closedTabsCount: weekTabsCount,
        });
    }

    return monthlyData;
}


export const filterTabsByMonth = (closedTabs: TabEntity[], year: number, month: number): TabEntity[] => {
    return closedTabs.filter((tab) => {
        if (!tab.closedAt) {
            return false;
        }

        const closedDate = new Date(tab.closedAt);
        const brazilDate = new Date(closedDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const closedYear = brazilDate.getUTCFullYear();
        const closedMonth = brazilDate.getUTCMonth();

        return closedYear === year && closedMonth === month;
    });
}


export const calculateLastNMonthsSalesData = (closedTabs: TabEntity[], referenceDate: Date, months = 6) => {
    const monthsData: Array<{
        monthLabel: string;
        year: number;
        month: number;
        totalRevenue: number;
        closedTabsCount: number;
    }> = [];

    const refBrazil = new Date(referenceDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const refYear = refBrazil.getUTCFullYear();
    const refMonth = refBrazil.getUTCMonth();

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(Date.UTC(refYear, refMonth - i, 1));
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth();

        const monthTabs = filterTabsByMonth(closedTabs, y, m);
        const monthRevenue = calculateTotalRevenue(monthTabs);

        monthsData.push({
            monthLabel: `${monthNames[m]} ${y}`,
            year: y,
            month: m,
            totalRevenue: monthRevenue,
            closedTabsCount: monthTabs.length,
        });
    }

    return monthsData;
}
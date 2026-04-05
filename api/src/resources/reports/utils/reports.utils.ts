import { TabEntity, TabStatus } from "src/resources/tab/entities/tab.entity";

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
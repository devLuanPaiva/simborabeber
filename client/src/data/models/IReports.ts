import { ProductCategory } from "./IProduct";

export interface ISalesIndicators {
    totalRevenue: number;
    todayRevenue: number;
    averageTicketValue: number;
    closedTabsCount: number;
    openedTabsCount: number;
}


export interface IDaysSalesData {
    dayOfWeek: string,
    dayNumber: number,
    totalRevenue: number,
    closedTabsCount: number
}

export interface IWeeksSalesData {
    weekLabel: string,
    weekNumber: number,
    totalRevenue: number,
    closedTabsCount: number
}


export interface IMonthsSalesData {
    monthLabel: string,
    year: number,
    month: number,
    totalRevenue: number,
    closedTabsCount: number
}

export interface ICategoryComparisonItem {
    category: ProductCategory,
    totalRevenue: number,
    totalCount: number,
    percentage: number
}
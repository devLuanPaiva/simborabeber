export class DayOfWeekSalesDto {

    dayOfWeek: string;

    dayNumber: number;

    totalRevenue: number;

    closedTabsCount: number;
}

export class WeeklySalesComparisonDto {

    days: DayOfWeekSalesDto[];
}

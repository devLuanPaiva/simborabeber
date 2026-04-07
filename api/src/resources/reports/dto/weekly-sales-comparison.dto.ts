export class DayOfWeekSalesDto {

    dayOfWeek: string;

    dayNumber: number;

    totalRevenue: number;

    closedTabsCount: number;
}

export class WeeklySalesComparisonDto {

    days: DayOfWeekSalesDto[];
}


export class WeekOfMonthSalesDto {
    weekLabel: string;

    weekNumber: number;

    totalRevenue: number;

    closedTabsCount: number;
}

export class MonthlyWeeklyComparisonDto {
    weeks: WeekOfMonthSalesDto[];
}

import { IWeeksSalesData } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { MonthlyWeeklySalesChart } from "./MonthlyWeeklySalesChart";

export async function MonthlyWeeklySalesComparation() {
    const response = await serverFetch("/reports/monthly-weekly-comparison")
    const data: ApiResponse<IWeeksSalesData[]> = await response.json();

    if (data.errors) {
        console.error("Erro ao obter dados de comparação mensal/semanal:", data.errors);
        return null;
    }

    const weeklyData = data.results;
    return <MonthlyWeeklySalesChart data={weeklyData} />;
}
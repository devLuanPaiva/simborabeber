import { ApiResponse } from "@/data/types";
import { IDaysSalesData } from "@/data/models";
import { serverFetch } from "@/lib/api/serverFetch";
import { WeeklySalesComparationChart } from "./WeeklySalesComparationChart";

export async function WeeklySalesComparation() {
    const response = await serverFetch("/reports/weekly-sales-comparison");
    const data: ApiResponse<IDaysSalesData[]> = await response.json();

    if (data.errors) {
        console.error("Erro ao obter dados de comparação semanal:", data.errors);
        return null;
    }

    const weeklyData = data.results;
    return <WeeklySalesComparationChart data={weeklyData} />;

}
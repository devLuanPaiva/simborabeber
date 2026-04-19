import { IMonthsSalesData } from "@/data/models";
import { ApiResponse } from "@/data/types/IApi";
import { serverFetch } from "@/lib/api/serverFetch";
import { LastMonthsChart } from "./LastMonthsChart";

export async function LastMonthsComparation() {
    const response = await serverFetch("/reports/last-months-comparison")
    const data: ApiResponse<IMonthsSalesData[]> = await response.json();

    if (data.errors) {
        console.error("Erro ao obter dados de comparação dos últimos meses:", data.errors);
        return null;
    }
    
    const monthsData = data.results;

    return (
        <div className="md:col-span-2">
            <LastMonthsChart data={monthsData} />
        </div>
    );
}
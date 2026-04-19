import { ICategoryComparisonData } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { CategoriesPieChart } from "./CategoriesPieChart";

export async function CategoriesComparation() {
    const response = await serverFetch("/reports/categories-comparison");

    const data: ApiResponse<ICategoryComparisonData[]> = await response.json();

    const categoriesData = data.results;

    return <CategoriesPieChart data={categoriesData} />;

}
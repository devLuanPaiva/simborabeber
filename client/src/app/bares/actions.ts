import { IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function getBares() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/bar`, {
            cache: "force-cache",
            next: {
                revalidate: 3600,
            }
        });

        if (!response.ok) {
            console.warn(`Erro ao buscar bares: ${response.status}`);
            return [];
        }

        const data: ApiResponse<IBar[]> = await response.json();
        const bars = data.results.filter((bar) => bar.isActive);

        return bars ?? [];
    } catch (error) {
        console.error("Erro ao buscar bares:", error);
        return [];
    }
}
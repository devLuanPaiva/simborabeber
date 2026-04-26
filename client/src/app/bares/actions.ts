import { IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";

let cachedBares: IBar[] | null = null;

export async function getBares() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/bar`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar bares: ${response.status}`);
            return cachedBares ?? [];
        }

        const data: ApiResponse<IBar[]> = await response.json();

        const activeBars = data?.results?.filter((bar) => bar.isActive) ?? [];

        if (activeBars.length > 0) {
            cachedBares = activeBars;
        }

        return activeBars;
    } catch (error) {
        console.error("Erro ao buscar bares:", error);

        return cachedBares ?? [];
    }
}
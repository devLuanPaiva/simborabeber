import { IBar, IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

let cachedBars: Map<string, IBar> = new Map();
let cachedProductsByBar: Map<string, IProduct[]> = new Map();

export async function getBarBySlug(slug: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/bar/${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar bar ${slug}: ${response.status}`);
            return cachedBars.get(slug) ?? null;
        }

        const data: ApiResponse<IBar> = await response.json();
        const bar = data?.results;


        if (bar) {
            cachedBars.set(slug, bar);
        }

        return bar;
    } catch (error) {
        console.error("Erro ao buscar dados do bar:", error);

        return cachedBars.get(slug) ?? null;
    }
}

export async function getProductsByBarSlug(slug: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/product/by-bar?slug=${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar produtos do bar ${slug}: ${response.status}`);
            return cachedProductsByBar.get(slug) ?? [];
        }

        const data: ApiResponse<IProduct[]> = await response.json();

        const products =
            data?.results?.filter((p) => p.isActive) ?? [];


        if (products.length > 0) {
            cachedProductsByBar.set(slug, products);
        }

        return products;
    } catch (error) {
        console.error("Erro ao buscar produtos do bar:", error);

        return cachedProductsByBar.get(slug) ?? [];
    }
}
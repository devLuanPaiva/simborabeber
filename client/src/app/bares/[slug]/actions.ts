import { IBar, IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function BarActions(slug: string) {
    try {

        const base_url = process.env.NEXT_PUBLIC_BASE_URL;

        const response_bar = await fetch(`${base_url}/bar/${slug}`, {
            cache: "force-cache",
            next: {
                revalidate: 3600,
            }
        });

        const data_bar: ApiResponse<IBar> = await response_bar.json();

        const bar = data_bar.results

        const response_products = await fetch(`${base_url}/product/by-bar?slug=${slug}`, {
            cache: "force-cache",
            next: {
                revalidate: 3600,
            }
        });

        const data_products: ApiResponse<IProduct[]> = await response_products.json();

        const products_results = data_products.results;

        const products = products_results.filter(p => p.isActive)

        return { bar, products };
    }
    catch (error) {
        console.error("Erro ao buscar dados do bar:", error);
        return { bar: null, products: [] };
    }
}
"use server"
import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function panelBarProductsActions(slug: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    const response_products = await fetch(`${base_url}/product/by-bar?slug=${slug}`, {
        cache: "force-cache",
        next: {
            revalidate: 3600,
        }
    });

    const data_products: ApiResponse<IProduct[]> = await response_products.json();

    const products = data_products.results;

    return products
}
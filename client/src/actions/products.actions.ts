"use server";
import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

let cachedProductsByBar: Map<string, IProduct[]> = new Map();
let cachedProductsById: Map<string, IProduct> = new Map();


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

export async function getProductById(id: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/product/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar produto ${id}: ${response.status}`);
            return cachedProductsById.get(id) ?? null;
        }

        const data: ApiResponse<IProduct> = await response.json();
        const product = data?.results;


        if (product) {
            cachedProductsById.set(id, product);
        }

        return product ?? null;

    } catch (error) {
        console.error("Erro ao buscar produto:", error);

        return cachedProductsById.get(id) ?? null;
    }
}
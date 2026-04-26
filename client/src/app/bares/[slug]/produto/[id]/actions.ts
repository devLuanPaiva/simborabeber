"use server"

import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

let cachedProductsById: Map<string, IProduct> = new Map();

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
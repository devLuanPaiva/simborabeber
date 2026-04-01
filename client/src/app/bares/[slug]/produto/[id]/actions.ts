"use server"

import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function ProductActions(slug: string, id: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${base_url}/product/${id}`, {
        cache: "force-cache",
        next: {
            revalidate: 60,
        }
    });

    const data: ApiResponse<IProduct> = await response.json();

    const product = data.results;

    return product ?? null;
}
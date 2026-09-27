"use server";
import { IProductAddon } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function getProductAddonsByBarSlug(slug: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/product-addon/by-bar?slug=${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar adicionais do bar ${slug}: ${response.status}`);
            return [];
        }

        const data: ApiResponse<IProductAddon[]> = await response.json();
        return data?.results ?? [];
    } catch (error) {
        console.error("Erro ao buscar adicionais do bar:", error);
        return [];
    }
}

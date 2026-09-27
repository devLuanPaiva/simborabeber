"use server";
import { IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";

let cachedBars: Map<string, IBar> = new Map();

export async function getBars() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/bar`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar bares: ${response.status}`);
            return [];
        }

        const data: ApiResponse<IBar[]> = await response.json();

        return data.results ?? [];
    } catch (error) {
        console.error("Erro ao buscar bares:", error);
        return [];
    }
}

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
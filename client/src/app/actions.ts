"use server"
import { IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function HomeActions() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${base_url}/bar`, {
        cache: "force-cache",
        next: {
            revalidate: 3600,
        }
    });

    const data: ApiResponse<IBar[]> = await response.json();

    const bars = data.results.filter((bar) => bar.isActive);

    return bars ?? [];
}
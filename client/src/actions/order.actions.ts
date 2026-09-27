"use server";
import { IOrder } from "@/data/models";
import { ApiResponse } from "@/data/types";

export async function getPublicOrder(id: string): Promise<IOrder | null> {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const response = await fetch(`${base_url}/order/${id}/public`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const data: ApiResponse<IOrder> = await response.json();
        return data?.results ?? null;
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        return null;
    }
}

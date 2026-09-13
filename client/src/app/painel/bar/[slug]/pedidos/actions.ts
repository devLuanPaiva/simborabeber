"use server"
import { IOrder } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPatch } from "@/lib/api/serverPatch";
import { revalidatePath } from "next/cache";

export async function getOrdersByBarSlug(slug: string): Promise<IOrder[]> {
    try {
        const response = await serverFetch(`/order/by-bar/${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar pedidos do bar ${slug}: ${response.status}`);
            return [];
        }

        const data: ApiResponse<IOrder[]> = await response.json();
        return data?.results ?? [];
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: string, slug: string) {
    try {
        const response = await serverPatch(`/order/${orderId}/status`, { status });
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data?.errors?.detail || data?.message || "Erro ao atualizar status do pedido",
            };
        }

        revalidatePath(`/painel/bar/${slug}/pedidos`);

        return { success: true };
    } catch (err) {
        console.error("Error updating order status:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

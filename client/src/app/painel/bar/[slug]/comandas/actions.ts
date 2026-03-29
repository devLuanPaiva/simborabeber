"use server"
import { ITab } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function tabsPanelBarActions(slug: string): Promise<ITab[]> {
    const response_tabs = await serverFetch(`/tab/by-bar/${slug}`, {
        cache: "no-cache",
    });

    const data_tabs: ApiResponse<ITab[]> = await response_tabs.json();

    return data_tabs.results ?? [];
}

export async function createTab(slug: string, formData: FormData) {
    try {
        const tableNumber = Number(formData.get("tableNumber"))
        const customerName = String(formData.get("customerName"))

        const response = await serverPost("/tab", {
            status: "open",
            tableNumber,
            customerName,
            totalValue: 0
        })

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.errors?.detail || "Erro ao criar comanda"
            }
        }

        revalidatePath(`/painel/bar/${slug}`)

        return {
            success: true,
            message: "Comanda criada com sucesso"
        }

    } catch (err) {
        console.error("Error creating tab:", err);
        return {
            success: false,
            error: "Erro inesperado"
        }
    }
}
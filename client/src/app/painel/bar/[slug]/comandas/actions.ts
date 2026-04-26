"use server"
import { ITab } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";


let cachedTabsByBar: Map<string, ITab[]> = new Map();

export async function getTabsByBarSlug(slug: string): Promise<ITab[]> {
    try {
        const response = await serverFetch(`/tab/by-bar/${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar comandas do bar ${slug}: ${response.status}`);
            return cachedTabsByBar.get(slug) ?? [];
        }

        const data: ApiResponse<ITab[]> = await response.json();

        const tabs = data?.results ?? [];

        if (tabs.length > 0) {
            cachedTabsByBar.set(slug, tabs);
        }

        return tabs;

    } catch (error) {
        console.error("Erro ao buscar comandas:", error);

        return cachedTabsByBar.get(slug) ?? [];
    }
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
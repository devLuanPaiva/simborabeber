"use server"
import { ITab } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function PanelBarActions(slug: string): Promise<ITab[]> {
    const response_tabs = await serverFetch(`/tab/by-bar/${slug}`, {
        cache: "no-cache",
    });

    const data_tabs: ApiResponse<ITab[]> = await response_tabs.json();

    return data_tabs.results ?? [];
}

export async function createTab(slug: string, formData: FormData) {
    const tableNumber = Number(formData.get("tableNumber"))
    const customerName = String(formData.get("customerName"))

    await serverPost("/tab", {
        status: "open",
        tableNumber,
        customerName,
        totalValue: 0
    })

    revalidatePath(`/painel/bar/${slug}`)
}
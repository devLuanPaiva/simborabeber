"use server"
import { IProduct, ITab, ITabItem } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function panelTabActions(slug: string, id: string) {

    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const response_tab = await serverFetch(`/tab/${id}`, {
        cache: "no-cache",
    });
    const data_tab: ApiResponse<ITab> = await response_tab.json();

    const tab = data_tab.results

    const response_products = await fetch(`${base_url}/product/by-bar?slug=${slug}`, {
        cache: "force-cache",
        next: {
            revalidate: 3600,
        }
    });

    const data_products: ApiResponse<IProduct[]> = await response_products.json();

    const products = data_products.results;

    const response_tab_items = await serverFetch(`/tab-item/by-tab/${id}`, {
        cache: "no-cache",
    });
    const data_tab_items: ApiResponse<ITabItem[]> = await response_tab_items.json();

    const tab_items = data_tab_items.results;

    return {
        tab,
        products,
        tab_items
    }
}

interface ICreateTab {
    slug: string;
    formData: FormData;
    tabId: string;
}

export async function addTabItem({ slug, tabId, formData }: Readonly<ICreateTab>) {
    const name = String(formData.get("name"))
    const price = Number(formData.get("price"))
    const quantity = Number(formData.get("quantity"))

    try {
        const response = await serverPost(`/tab-item/by-tab/${tabId}`, {
            name,
            price,
            quantity,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao adicionar item" };
        }

        revalidatePath(`/painel/bar/${slug}/comanda/${tabId}`);
        return { success: true, message: "Item adicionado com sucesso" };
    } catch (err) {
        console.error("Error adding tab item:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function addTabItems({ slug, tabId, formData }: Readonly<ICreateTab>) {
    const entry = formData.get("items");
    let items: ITabItem[] = [];

    try {
        let parsed: unknown = undefined;

        if (entry === null) {
            parsed = undefined;
        } else if (typeof entry === "string") {
            parsed = JSON.parse(entry);
        } else if (entry && typeof (entry as { text?: () => Promise<string> }).text === "function") {
            const text = await (entry as { text: () => Promise<string> }).text();
            parsed = JSON.parse(text);
        } else {
            parsed = entry;
        }

        if (Array.isArray(parsed)) {
            for (const el of parsed) {
                if (!el || typeof el !== "object") continue;
                const obj = el as Record<string, unknown>;

                const name = typeof obj.name === "string" ? obj.name.trim() : undefined;

                const rawPrice = obj.price;
                const price = rawPrice

                const rawQuantity = obj.quantity;
                const quantity = rawQuantity

                if (!name) continue;
                if (!Number.isFinite(price)) continue;
                if (!Number.isFinite(quantity)) continue;

                items.push({ name, price, quantity } as ITabItem);
            }
        }
    } catch {
        items = [];
    }

    try {
        const response = await serverPost(`/tab-item/bulk/by-tab/${tabId}`, { items });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao adicionar itens" };
        }

        revalidatePath(`/painel/bar/${slug}/comanda/${tabId}`);
        return { success: true, message: "Itens adicionados com sucesso" };
    } catch (err) {
        console.error("Error adding tab items:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function deleteTabItem({ slug, tabId, itemId }: { slug: string; tabId: string; itemId: string }) {
    try {
        const response = await serverFetch(`/tab-item/${itemId}`, {
            method: "DELETE",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao remover item" };
        }

        revalidatePath(`/painel/bar/${slug}/comanda/${tabId}`);
        return { success: true, message: "Item removido" };
    } catch (err) {
        console.error("Error deleting tab item:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function closeTab({ slug, tabId }: { slug: string; tabId: string }) {
    try {
        const response = await serverPost(`/tab/close/${tabId}`, {});
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao fechar comanda" };
        }

        revalidatePath(`/painel/bar/${slug}`);
        return { success: true, message: "Comanda fechada com sucesso" };
    } catch (err) {
        console.error("Error closing tab:", err);

        return { success: false, error: "Erro inesperado" };
    }
}

export async function updateItemQuantity({ slug, tabId, itemId, quantity }: { slug: string; tabId: string; itemId: string; quantity: number }) {
    try {
        const response = await serverPatch(`/tab-item/${itemId}/quantity`, { quantity });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao atualizar quantidade" };
        }

        revalidatePath(`/painel/bar/${slug}/comanda/${tabId}`);
        return { success: true, message: "Quantidade atualizada" };
    } catch (err) {
        console.error("Error updating item quantity:", err);

        return { success: false, error: "Erro inesperado" };
    }
}
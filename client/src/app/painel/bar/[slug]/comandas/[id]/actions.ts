"use server"
import { ITab, ITabItem, ProductCategory } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

let cachedTabsById: Map<string, ITab> = new Map();
let cachedTabItemsByTabId: Map<string, ITabItem[]> = new Map();

export async function getTabById(id: string) {
    try {
        const response = await serverFetch(`/tab/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar tab ${id}: ${response.status}`);
            return cachedTabsById.get(id) ?? null;
        }

        const data: ApiResponse<ITab> = await response.json();
        const tab = data?.results;


        if (tab) {
            cachedTabsById.set(id, tab);
        }

        return tab ?? null;

    } catch (error) {
        console.error("Erro ao buscar tab:", error);

        return cachedTabsById.get(id) ?? null;
    }
}

export async function getTabItemsByTabId(id: string) {
    try {
        const response = await serverFetch(`/tab-item/by-tab/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Erro ao buscar itens da tab ${id}: ${response.status}`);
            return cachedTabItemsByTabId.get(id) ?? [];
        }

        const data: ApiResponse<ITabItem[]> = await response.json();

        const items = data?.results ?? [];


        if (items.length > 0) {
            cachedTabItemsByTabId.set(id, items);
        }

        return items;

    } catch (error) {
        console.error("Erro ao buscar itens da tab:", error);

        return cachedTabItemsByTabId.get(id) ?? [];
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
    const category = String(formData.get("category"))

    try {
        const response = await serverPost(`/tab-item/by-tab/${tabId}`, {
            name,
            price,
            quantity,
            category

        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao adicionar item" };
        }

        revalidatePath(`/painel/bar/${slug}/comandas/${tabId}`);
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
                const category: ProductCategory = typeof obj.category === "string" && Object.values(ProductCategory).includes(obj.category as ProductCategory) ? obj.category as ProductCategory : ProductCategory.OTHER;

                if (!name) continue;
                if (!Number.isFinite(price)) continue;
                if (!Number.isFinite(quantity)) continue;

                items.push({ name, price, quantity, category } as ITabItem);
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

        revalidatePath(`/painel/bar/${slug}/comandas/${tabId}`);
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

        revalidatePath(`/painel/bar/${slug}/comandas/${tabId}`);
        return { success: true, message: "Item removido" };
    } catch (err) {
        console.error("Error deleting tab item:", err);
        return { success: false, error: "Erro inesperado" };
    }
}


export async function closeTab({ slug, tabId, itemsCount }: { slug: string; tabId: string; itemsCount: number }) {
    try {
        const response = await serverPost(`/tab/close/${tabId}`, {});
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, error: data.errors?.detail || "Erro ao fechar comanda" };
        }

        if (itemsCount === 0) {
            redirect(`/painel/bar/${slug}/comandas`);
        }

        revalidatePath(`/painel/bar/${slug}/comandas/${tabId}`);

        return { success: true, message: "Comanda fechada com sucesso" };

    } catch (err) {
        if (isRedirectError(err)) {
            throw err;
        }

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

        revalidatePath(`/painel/bar/${slug}/comandas/${tabId}`);
        return { success: true, message: "Quantidade atualizada" };
    } catch (err) {
        console.error("Error updating item quantity:", err);

        return { success: false, error: "Erro inesperado" };
    }
}
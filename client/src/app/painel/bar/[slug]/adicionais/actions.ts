"use server"
import { getFormStringValue } from "@/data/helpers";
import { IProductAddon, ProductCategory } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverDelete } from "@/lib/api/serverDelete";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function createProductAddon(formData: FormData, slug: string) {
    const name = getFormStringValue(formData, "name").trim();
    const price = Number(formData.get("price"));
    const category = getFormStringValue(formData, "category").trim();

    if (!name || Number.isNaN(price)) {
        return { success: false, error: "Preencha nome e preço corretamente" };
    }

    const addon: Partial<IProductAddon> = {
        name,
        price,
        ...(category ? { category: category as ProductCategory } : {}),
    };

    try {
        const response = await serverPost("/product-addon", addon);
        const body: ApiResponse<IProductAddon> = await response.json().catch(() => ({} as ApiResponse<IProductAddon>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao criar adicional" };
        }

        revalidatePath(`/painel/bar/${slug}/adicionais`);
        return { success: true, message: "Adicional criado com sucesso" };
    } catch (err) {
        console.error("Error creating product addon:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function updateProductAddon(id: string, slug: string, formData: FormData) {
    const payload: Partial<IProductAddon> = {};

    const nameVal = formData.get("name");
    if (typeof nameVal === "string" && nameVal.trim() !== "") payload.name = nameVal.trim();

    const priceVal = formData.get("price");
    if (priceVal !== null && String(priceVal).trim() !== "") {
        const n = Number(priceVal);
        if (!Number.isNaN(n)) payload.price = n;
    }

    const categoryVal = formData.get("category");
    if (typeof categoryVal === "string") {
        const trimmed = categoryVal.trim();
        payload.category = trimmed === "" ? undefined : (trimmed as ProductCategory);
    }

    try {
        const response = await serverPatch(`/product-addon/${id}`, payload);
        const body: ApiResponse<IProductAddon> = await response.json().catch(() => ({} as ApiResponse<IProductAddon>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao atualizar adicional" };
        }

        revalidatePath(`/painel/bar/${slug}/adicionais`);
        return { success: true, message: "Adicional atualizado com sucesso" };
    } catch (err) {
        console.error("Error updating product addon:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function toggleProductAddonStatus(id: string, slug: string) {
    try {
        const response = await serverPost(`/product-addon/toggle-status/${id}`, {});
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao alterar status" };
        }

        revalidatePath(`/painel/bar/${slug}/adicionais`);
        return { success: true, message: body?.message || "Status atualizado" };
    } catch (err) {
        console.error("Error toggling product addon status:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function deleteProductAddon(id: string, slug: string) {
    try {
        const response = await serverDelete(`/product-addon/${id}`);
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao remover adicional" };
        }

        revalidatePath(`/painel/bar/${slug}/adicionais`);
        return { success: true, message: body?.message || "Adicional removido" };
    } catch (err) {
        console.error("Error deleting product addon:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

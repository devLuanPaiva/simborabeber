"use server"
import { IProduct, ProductCategory } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverDelete } from "@/lib/api/serverDelete";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function panelBarProductActions(id: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${base_url}/product/${id}`, {
        cache: "force-cache",
        next: {
            revalidate: 60,
        }
    });

    const data: ApiResponse<IProduct> = await response.json();

    const product = data.results;

    return product ?? null;
}

export async function updateProduct(id: string, slug: string, formData: FormData) {

    const payload: Partial<IProduct> = {};
    const nameVal = formData.get("name");
    if (typeof nameVal === "string" && nameVal.trim() !== "") payload.name = nameVal.trim();

    const priceVal = formData.get("price");
    if (priceVal !== null && String(priceVal).trim() !== "") {
        const n = Number(priceVal);
        if (!Number.isNaN(n)) payload.price = n;
    }

    const descriptionVal = formData.get("description");
    if (typeof descriptionVal === "string" && descriptionVal.trim() !== "") payload.description = descriptionVal.trim();

    const categoryVal = formData.get("category");
    if (typeof categoryVal === "string") {
        const trimmed = categoryVal.trim();
        if (trimmed !== "" && Object.values(ProductCategory).includes(trimmed as ProductCategory)) {
            payload.category = trimmed as ProductCategory;
        }
    }

    const imageVal = formData.get("image");
    if (typeof imageVal === "string" && imageVal.trim() !== "") payload.image = imageVal.trim();

    if (Object.keys(payload).length === 0) {
        return { success: false, error: "Nenhuma alteração fornecida" };
    }

    try {
        const response = await serverPatch(`/product/${id}`, payload);
        const body: ApiResponse<IProduct> = await response.json().catch(() => ({} as ApiResponse<IProduct>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao atualizar produto" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos/editar/${id}`);
        return { success: true, message: "Produto atualizado com sucesso" };
    } catch (err) {
        console.error("Error updating product:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function toggleProductStatus(id: string, slug: string) {
    try {
        const response = await serverPost(`/product/toggle-status/${id}`, {});
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao alterar status" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos/editar/${id}`);
        return { success: true, message: body?.message || "Status atualizado" };
    } catch (err) {
        console.error("Error toggling product status:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function deleteProduct(id: string, slug: string) {
    try {
        const response = await serverDelete(`/product/${id}`);
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao remover produto" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos`);
        return { success: true, message: body?.message || "Produto removido" };
    } catch (err) {
        console.error("Error deleting product:", err);
        return { success: false, error: "Erro inesperado" };
    }
}
"use server"
import { IProduct, IProductVariant, ProductCategory } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverDelete } from "@/lib/api/serverDelete";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";


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

export async function createProductVariant(productId: string, slug: string, formData: FormData) {
    const label = String(formData.get("label") ?? "").trim();
    const price = Number(formData.get("price"));
    const numberOfSlices = Number(formData.get("numberOfSlices"));

    if (!label || Number.isNaN(price) || Number.isNaN(numberOfSlices) || numberOfSlices < 1) {
        return { success: false, error: "Preencha tamanho, preço e número de fatias corretamente" };
    }

    try {
        const response = await serverPost(`/product-variant/by-product/${productId}`, { label, price, numberOfSlices });
        const body: ApiResponse<IProductVariant> = await response.json().catch(() => ({} as ApiResponse<IProductVariant>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao criar variação" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos/editar/${productId}`);
        return { success: true, message: "Variação criada com sucesso" };
    } catch (err) {
        console.error("Error creating product variant:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function updateProductVariant(variantId: string, productId: string, slug: string, formData: FormData) {
    const payload: Partial<IProductVariant> = {};

    const labelVal = formData.get("label");
    if (typeof labelVal === "string" && labelVal.trim() !== "") payload.label = labelVal.trim();

    const priceVal = formData.get("price");
    if (priceVal !== null && String(priceVal).trim() !== "") {
        const n = Number(priceVal);
        if (!Number.isNaN(n)) payload.price = n;
    }

    const numberOfSlicesVal = formData.get("numberOfSlices");
    if (numberOfSlicesVal !== null && String(numberOfSlicesVal).trim() !== "") {
        const n = Number(numberOfSlicesVal);
        if (!Number.isNaN(n)) payload.numberOfSlices = n;
    }

    try {
        const response = await serverPatch(`/product-variant/${variantId}`, payload);
        const body: ApiResponse<IProductVariant> = await response.json().catch(() => ({} as ApiResponse<IProductVariant>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao atualizar variação" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos/editar/${productId}`);
        return { success: true, message: "Variação atualizada com sucesso" };
    } catch (err) {
        console.error("Error updating product variant:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function deleteProductVariant(variantId: string, productId: string, slug: string) {
    try {
        const response = await serverDelete(`/product-variant/${variantId}`);
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao remover variação" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos/editar/${productId}`);
        return { success: true, message: body?.message || "Variação removida" };
    } catch (err) {
        console.error("Error deleting product variant:", err);
        return { success: false, error: "Erro inesperado" };
    }
}
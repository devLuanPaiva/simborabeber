"use server"
import { createSlug, generateRandomString } from "@/data/functions";
import { getFormStringValue } from "@/data/helpers";
import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";


export async function uploadImage(file: File, productName: string) {
    const slug = createSlug(productName);
    const randomSuffix = generateRandomString(6);
    const ext = file.name.split(".").pop() || "";
    const newFileName = `${slug}-${randomSuffix}${ext ? "." + ext : ""}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", newFileName);
    formData.append("path", "produtos");
    const base_url = process.env.NEXT_PUBLIC_API_URL || "";

    const response = await fetch(`${base_url}/api/images/upload`, {
        method: "POST",
        headers: {
            "x-client-origin": base_url,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        return {
            success: false,
            error: errorData.errors?.detail || "Erro ao fazer upload da imagem",
        }

    }

    const result = await response.json();
    return { success: true, url: result.result?.url || result.url || "" };
}

export async function createProduct(formData: FormData, slug: string) {
    const productName = getFormStringValue(formData, "productName");
    const price = Number(formData.get("price"));
    const description = getFormStringValue(formData, "description");
    const category = getFormStringValue(formData, "category");
    const imageUrl = getFormStringValue(formData, "imageUrl");

    const product: Partial<IProduct> = {
        name: productName,
        price,
        description,
        category: category as IProduct["category"],
        image: imageUrl,
    }

    try {
        const response_post = await serverPost("/product", product);
        const responseBody: ApiResponse<IProduct> = await response_post.json().catch(() => ({} as ApiResponse<IProduct>));

        if (!response_post.ok) {
            return { success: false, error: responseBody.errors?.detail || "Erro ao criar produto" };
        }

        revalidatePath(`/painel/bar/${slug}/produtos`);
        return { success: true, message: "Produto criado com sucesso" };
    } catch (err) {
        console.error("Error creating product:", err);
        return { success: false, error: "Erro inesperado" };
    }
}
"use server"

import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

function getFormStringValue(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
}

function textToSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function generateRandomString(length: number = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function uploadImage(file: File, productName: string): Promise<string> {
    const slug = textToSlug(productName);
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
        throw new Error(errorData.message || "Erro ao enviar a imagem.");
    }

    const result = await response.json();
    return result.result?.url || result.url || "";
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
"use server"

import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

function getFormStringValue(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);

    const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar a imagem.");
    }

    const result = await response.json();
    return result.url;
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

    const response_post = await serverPost("/product", product)

    const response: ApiResponse<IProduct> = await response_post.json()

    if (response.errors) {
        console.error(response.errors.detail || "Erro ao criar produto.")
    }

    revalidatePath(`/painel/bar/${slug}/produtos`)

}
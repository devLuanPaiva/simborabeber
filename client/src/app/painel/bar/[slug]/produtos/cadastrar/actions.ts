"use server"

import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

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
    const productName = String(formData.get("productName"));
    const price = Number(formData.get("price"));
    const description = String(formData.get("description"));
    const imageUrl = String(formData.get("imageUrl"));

    await serverPost("/product", {
        name: productName,
        price,
        description,
        imageUrl,
    })

    revalidatePath(`/painel/bar/${slug}/produtos`)

}
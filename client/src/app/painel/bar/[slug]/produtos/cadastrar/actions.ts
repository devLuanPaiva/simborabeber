"use server"
import { createSlug, generateRandomString } from "@/data/functions";
import { getFormStringValue } from "@/data/helpers";
import { IProduct } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { uploadToS3 } from "@/lib/aws/uploadToS3";
import { revalidatePath } from "next/cache";
const MAX_FILE_SIZE = 50 * 1024 * 1024;


export async function uploadImage(
    file: File,
    productName: string,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            error: "Arquivo muito grande. Máximo de 50 MB permitido.",
        };
    }

    const slug = createSlug(productName);
    const randomSuffix = generateRandomString(6);
    const ext = file.name.split(".").pop() || "";
    const newFileName = `${slug}-${randomSuffix}${ext ? "." + ext : ""}`;
    const key = `produtos/${newFileName}`;

    console.log("[uploadImage:product] starting upload", JSON.stringify({
        key,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
    }, null, 2));

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadToS3({ buffer, key, contentType: file.type });

        console.log("[uploadImage:product] upload finished", JSON.stringify({ url }, null, 2));

        return { success: true, url };
    } catch (error) {
        console.error("[uploadImage:product] upload failed", error instanceof Error ? error.message : JSON.stringify(error, null, 2));
        return {
            success: false,
            error: "Erro ao fazer upload da imagem",
        };
    }
}

export async function createProduct(formData: FormData, slug: string) {
    const productName = getFormStringValue(formData, "productName");
    const priceRaw = getFormStringValue(formData, "price");
    const price = priceRaw ? Number(priceRaw) : undefined;
    const description = getFormStringValue(formData, "description");
    const category = getFormStringValue(formData, "category");
    const imageUrl = getFormStringValue(formData, "imageUrl");
    const variantsRaw = getFormStringValue(formData, "variants");

    let variants: IProduct["variants"];
    if (variantsRaw) {
        try {
            const parsed = JSON.parse(variantsRaw);
            if (Array.isArray(parsed) && parsed.length > 0) variants = parsed;
        } catch {
            // invalid JSON is treated the same as "no variants"
        }
    }

    const product: Partial<IProduct> = {
        name: productName,
        price,
        description,
        category: category as IProduct["category"],
        image: imageUrl,
        ...(variants ? { variants } : {}),
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
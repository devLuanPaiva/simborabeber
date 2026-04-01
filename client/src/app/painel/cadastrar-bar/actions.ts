"use server"

import { createSlug, generateRandomString } from "@/data/functions";
import { getFormStringValue } from "@/data/helpers";
import { AccessPlan, IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function uploadImage(file: File, productName: string): Promise<string> {
    const slug = createSlug(productName);
    const randomSuffix = generateRandomString(6);
    const ext = file.name.split(".").pop() || "";
    const newFileName = `${slug}-${randomSuffix}${ext ? "." + ext : ""}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", newFileName);
    formData.append("path", "bares");
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


export async function registerBar(formData: FormData) {
    const name = getFormStringValue(formData, "name");
    const slug = createSlug(name);
    const address = getFormStringValue(formData, "address");
    const imageUrl = getFormStringValue(formData, "imageUrl");
    const accessPlan = AccessPlan.BASIC

    const barData: Partial<IBar> = {
        name,
        slug,
        image: imageUrl,
        accessPlan,
        address
    }

    try {
        const response_bar = await serverPost("/bar", barData);
        const responseBody: ApiResponse<IBar> = await response_bar.json().catch(() => ({} as ApiResponse<IBar>));

        if (!response_bar.ok) {
            return { success: false, error: responseBody.errors?.detail || "Erro ao cadastrar bar" };
        }

        revalidatePath(`/painel/bar/${slug}`)
        return { success: true, message: "Bar cadastrado com sucesso" };
    } catch (error) {
        console.error("Erro ao cadastrar bar:", error);
        return { success: false, error: "Erro ao cadastrar bar" };
    }

}
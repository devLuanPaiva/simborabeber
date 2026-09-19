"use server"

import { createSlug, generateRandomString } from "@/data/functions";
import { getFormStringValue } from "@/data/helpers";
import { AccessPlan, IBar } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverPost } from "@/lib/api/serverPost";
import { uploadToS3 } from "@/lib/aws/uploadToS3";
import { revalidatePath } from "next/cache";

export async function uploadImage(
    file: File,
    barName: string,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
    const slug = createSlug(barName);
    const randomSuffix = generateRandomString(6);
    const ext = file.name.split(".").pop() || "";
    const newFileName = `${slug}-${randomSuffix}${ext ? "." + ext : ""}`;
    const key = `bares/${newFileName}`;

    console.log("[uploadImage:bar] starting upload", JSON.stringify({
        key,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
    }, null, 2));

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadToS3({ buffer, key, contentType: file.type });

        console.log("[uploadImage:bar] upload finished", JSON.stringify({ url }, null, 2));

        return { success: true, url };
    } catch (error) {
        console.error("[uploadImage:bar] upload failed", error instanceof Error ? error.message : JSON.stringify(error, null, 2));
        return {
            success: false,
            error: "Erro ao fazer upload da imagem",
        };
    }
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
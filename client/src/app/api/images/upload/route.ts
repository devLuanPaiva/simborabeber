import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws/s3";
import { apiError } from "@/lib/api/api-error";
import { formatApiResponse } from "@/lib/api/api-response";
import { corsErrorResponse, getCorsHeaders, isOriginAllowed, withCors } from "@/lib/api/api-cors";

export async function OPTIONS(req: Request) {
    const origin = req.headers.get("x-client-origin");
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin) as Record<string, string>,
    });
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get("x-client-origin");
    if (!isOriginAllowed(origin)) {
        return corsErrorResponse();
    }

    const formData = await req.formData();
    return await handleUpload(formData, req);
}

const sanitizeFilename = (name: string) => {
    const normalized = name.replace(/\\/g, "/");
    const segments = normalized
        .split("/")
        .filter((segment) => segment && segment !== "." && segment !== "..")
        .map((segment) =>
            segment.replace(/[^\w.\-]/g, "_").replace(/_{2,}/g, "_").trim(),
        )
        .filter(Boolean);

    return segments.join("/");
};

async function handleUpload(formData: FormData, req: Request) {
    try {
        const file = formData.get("file") as File | null;
        const fileNameFromForm = formData.get("filename") as string | null;
        const path = formData.get("path") as string | null;

        if (!process.env.BUCKET_NAME_AWS || !process.env.REGION_AWS) {
            return apiError({
                statusCode: 500,
                message: "S3 configuration missing",
                code: "S3_CONFIG_MISSING",
                detail: "Configuração do S3 ausente no servidor.",
            });
        }

        if (!file) {
            return apiError({
                statusCode: 400,
                message: "File is required",
                code: "FILE_REQUIRED",
                detail: "O arquivo é obrigatório.",
            });
        }

        const fallbackName = file.name || `upload-${Date.now()}`;
        const safeName = sanitizeFilename(fileNameFromForm || fallbackName);

        if (!safeName) {
            return apiError({
                statusCode: 400,
                message: "Invalid filename",
                code: "INVALID_FILENAME",
                detail: "Nome de arquivo inválido.",
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const key = path ? `${path}/${safeName}` : safeName;

        const params = {
            Bucket: process.env.BUCKET_NAME_AWS,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        };

        await s3.send(new PutObjectCommand(params));

        const url = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.REGION_AWS}.amazonaws.com/${params.Key}`;
        return withCors(req, formatApiResponse({ url }, req));
    } catch (error) {
        console.error("Upload error:", error);
        return apiError({
            statusCode: 500,
            message: "Internal server error",
            code: "UPLOAD_ERROR",
            detail: "Erro inesperado ao enviar o arquivo.",
        });
    }
}
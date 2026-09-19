import { NextResponse } from "next/server";
import { apiError } from "./api-error";

const allowedOrigins = new Set([
    "https://oseucardapio.com.br",
    "https://www.oseucardapio.com.br",
    
]);

export function getCorsHeaders(origin: string | null) {
    if (origin && allowedOrigins.has(origin)) {
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };
    }

    return {};
}

export function isOriginAllowed(origin: string | null): boolean {
    return origin !== null && allowedOrigins.has(origin);
}

export function withCors<T>(
    req: Request,
    body: T,
    init?: ResponseInit
) {
    const origin = req.headers.get("x-client-origin");

    const corsHeaders = getCorsHeaders(origin);
    const headers = new Headers(init?.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));

    return NextResponse.json(body, {
        ...init,
        headers,
    });
}

export function corsErrorResponse() {
    return apiError({
        statusCode: 403,
        message: "Erro de CORS: Origem não permitida",
        code: "CORS_ORIGIN_NOT_ALLOWED",
        detail: "A origem da requisição não é permitida pelo servidor.",
    })
}
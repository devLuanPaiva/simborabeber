"use server";

import { ApiResponse, AuthResponse } from "@/data/types";
import { decodeToken } from "@/lib/decodeToken";
import { redirectByRole } from "@/lib/redirectByRole";
import { cookies } from "next/headers";

export type LoginActionState = {
    error: string | null;
};

function isRedirectError(error: unknown): boolean {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    return "digest" in error && typeof error.digest === "string" && error.digest.includes("NEXT_REDIRECT");
}

export async function loginAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
    const rawEmail = formData.get("email");
    const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
    const rawPassword = formData.get("password");
    const password = typeof rawPassword === "string" ? rawPassword : "";
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    if (!email || !password) {
        return { error: "Email e senha são obrigatórios." };
    }

    if (!base_url) {
        return { error: "URL base da API não configurada." };
    }

    try {
        const response = await fetch(`${base_url}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: ApiResponse<AuthResponse> = await response.json();

        const accessToken = data?.results?.accessToken;
        const refreshToken = data?.results?.refreshToken;

        if (data.errors) {
            return { error: data.errors.detail || "Erro desconhecido durante o login." };
        }

        if (!accessToken || !refreshToken) {
            return { error: "Tokens inválidos retornados pela API." };
        }

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
        });

        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
        });

        const user = decodeToken(accessToken);

        redirectByRole(user);
        return { error: null };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { error: "Não foi possível concluir o login. Tente novamente." };
    }
}
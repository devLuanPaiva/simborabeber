'use client';
import { useCallback } from "react";

const URL_BASE = process.env.NEXT_PUBLIC_URL_BASE;

export interface APIError {
    code: string;
    field?: string;
    detail: string;
}

export interface ApiResponse<T> {
    data: T;
    count: number;
    next: string | null;
    previous: string | null;
    error: APIError | null;
    isLoading: boolean;
}

export interface MutationVariables {
    method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH";
    body: Record<string, unknown>;
}

export function useAPI() {
    const getToken = () => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("access_token") || undefined;
        }
        return undefined;
    };
    const buildHeaders = useCallback(() => {
        const token = getToken();
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    }, []);

    const request = useCallback(
        async function <T>(
            method: string,
            url: string,
            body?: Record<string, unknown>
        ): Promise<ApiResponse<T>> {
            const path = url.startsWith("/") ? url : `/${url}`;
            let fullUrl = `${URL_BASE}${path}`;
            let allData: unknown[] = [];
            let count = 0;
            let nextUrl: string | null = null;

            try {
                do {
                    const response = await fetch(fullUrl, {
                        method,
                        headers: buildHeaders(),
                        body: method !== "GET" && body ? JSON.stringify(body) : undefined,
                    });

                    const content = await response.json();

                    if (!response.ok || content.status === "error") {
                        return {
                            data: null as unknown as T,
                            count: 0,
                            next: null,
                            previous: null,
                            error: {
                                code: content.errors?.code ?? "unknown_error",
                                field: content.errors?.field,
                                detail: content.errors?.detail ?? content.message ?? "Erro desconhecido",
                            },
                            isLoading: false,
                        };
                    }

                    if (method === "GET") {
                        if (Array.isArray(content.results)) {
                            allData = [...allData, ...content.results];
                            count = content.count ?? allData.length;
                            nextUrl = content.next;

                            if (nextUrl) {
                                try {
                                    const base = URL_BASE ?? (typeof window !== "undefined" ? window.location.origin : "");
                                    let resolved = new URL(nextUrl, base).toString();

                                    if (resolved.startsWith("http://")) {
                                        resolved = resolved.replace(/^http:\/\//i, "https://");
                                    }
                                    fullUrl = resolved;
                                } catch {
                                    let candidate = nextUrl;
                                    const isAbsolute = candidate.startsWith("http://") || candidate.startsWith("https://");
                                    if (!isAbsolute) {
                                        const clean = candidate.startsWith("/") ? candidate : `/${candidate}`;
                                        candidate = `${URL_BASE ?? ""}${clean}`;
                                    }
                                    if (candidate.startsWith("http://")) {
                                        candidate = candidate.replace(/^http:\/\//i, "https://");
                                    }
                                    fullUrl = candidate;
                                }
                            } else {
                                nextUrl = null;
                            }
                        } else if (content.result && typeof content.result === "object") {

                            return {
                                data: content.result as T,
                                count: 1,
                                next: null,
                                previous: null,
                                error: null,
                                isLoading: false,
                            };
                        } else {
                            const rawData = content.data ?? content;
                            return {
                                data: rawData as T,
                                count: 1,
                                next: null,
                                previous: null,
                                error: null,
                                isLoading: false,
                            };
                        }
                    } else {
                        const rawData = content.data ?? content;
                        return {
                            data: rawData as T,
                            count: 1,
                            next: null,
                            previous: null,
                            error: null,
                            isLoading: false,
                        };
                    }

                } while (nextUrl);

                return {
                    data: allData as T,
                    count,
                    next: null,
                    previous: null,
                    error: null,
                    isLoading: false,
                };

            } catch (err: unknown) {
                const detail =
                    err instanceof Error ? err.message : "Erro ao processar resposta do servidor";
                return {
                    data: null as unknown as T,
                    count: 0,
                    next: null,
                    previous: null,
                    error: {
                        code: "network_error",
                        detail,
                    },
                    isLoading: false,
                };
            }
        },
        [buildHeaders]
    );

    const httpGET = <T>(url: string) => request<T>("GET", url);
    const httpPOST = <T>(url: string, payload: MutationVariables) =>
        request<T>(payload.method, url, payload.body);
    const httpPATCH = <T>(url: string, payload: MutationVariables) =>
        request<T>(payload.method, url, payload.body);
    const httpDELETE = <T = void>(url: string) => request<T>("DELETE", url);

    return { httpGET, httpPOST, httpPATCH, httpDELETE };
}
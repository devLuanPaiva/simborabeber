import { getBaseUrl } from "@/data/helpers"

type PaginatedResponse<T> = {
    status: "success"
    count: number
    currentPage: number
    totalPages: number
    next: string | null
    previous: string | null
    results: T[]
}

type SingleResponse<T> = {
    status: "success"
    result: T
}


export function formatApiResponse<T>(
    data: T | T[],
    request: Request
): PaginatedResponse<T> | SingleResponse<T> {
    const url = new URL(request.url)

    const offset = Number(url.searchParams.get("offset")) || 0
    const limit = Number(url.searchParams.get("limit")) || 30

    const base = getBaseUrl(request)
    const baseUrl = `${base}${url.pathname}`

    if (Array.isArray(data)) {
        const count = data.length
        const currentPage = Math.floor(offset / limit) + 1
        const totalPages = Math.ceil(count / limit)

        const results = data.slice(offset, offset + limit)

        const buildUrl = (newOffset: number) => {
            const params = new URLSearchParams(url.searchParams)
            params.set("offset", String(newOffset))
            params.set("limit", String(limit))
            return `${baseUrl}?${params.toString()}`
        }

        const hasNext = results.length === limit && currentPage < totalPages
        const hasPrevious = currentPage > 1

        return {
            status: "success",
            count,
            currentPage,
            totalPages,
            next: hasNext ? buildUrl(offset + limit) : null,
            previous: hasPrevious
                ? buildUrl(Math.max(0, offset - limit))
                : null,
            results,
        }
    }

    return {
        status: "success",
        result: data,
    }
}
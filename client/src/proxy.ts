import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decodeToken } from "@/lib/auth/decodeToken"
import { IJwtPayload } from "@/data/types"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

type RefreshedTokens = {
    accessToken: string
    refreshToken: string
}

async function tryRefreshAccessToken(refreshToken: string): Promise<RefreshedTokens | null> {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) return null

        const data = await response.json()
        const newAccessToken = data?.results?.accessToken
        const newRefreshToken = data?.results?.refreshToken

        if (!newAccessToken || !newRefreshToken) return null

        return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch {
        return null
    }
}

function panelPathForUser(user: IJwtPayload): string | null {
    if (user.role === "admin") return "/painel/usuarios"
    if (user.role === "manager") return user.slug ? `/painel/bar/${user.slug}` : "/painel/cadastrar-bar"
    if (user.role === "waiter" && user.slug) return `/painel/bar/${user.slug}`
    return null
}

function setAuthCookies(response: NextResponse, tokens: RefreshedTokens): NextResponse {
    response.cookies.set("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
    })

    response.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    return response
}

function handleAcessar(request: NextRequest, accessToken: string | undefined, refreshToken: string | undefined) {
    if (accessToken) {
        const path = panelPathForUser(decodeToken(accessToken))
        return path ? NextResponse.redirect(new URL(path, request.url)) : NextResponse.next()
    }

    if (!refreshToken) {
        return NextResponse.next()
    }

    return tryRefreshAccessToken(refreshToken).then((refreshed) => {
        if (!refreshed) return NextResponse.next()

        const path = panelPathForUser(decodeToken(refreshed.accessToken))
        const response = path
            ? NextResponse.redirect(new URL(path, request.url))
            : NextResponse.next()

        return setAuthCookies(response, refreshed)
    })
}

async function handlePainel(request: NextRequest, accessToken: string | undefined, refreshToken: string | undefined) {
    if (accessToken) {
        return NextResponse.next()
    }

    if (refreshToken) {
        const refreshed = await tryRefreshAccessToken(refreshToken)

        if (refreshed) {
            return setAuthCookies(NextResponse.next(), refreshed)
        }
    }

    return NextResponse.redirect(new URL("/acessar", request.url))
}

export async function proxy(request: NextRequest) {
    const host = request.headers.get("host")

    if (host === "painel.oseucardapio.com.br") {
        return NextResponse.redirect(
            new URL("https://www.oseucardapio.com.br/acessar")
        )
    }

    const accessToken = request.cookies.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (request.nextUrl.pathname === "/acessar") {
        return handleAcessar(request, accessToken, refreshToken)
    }

    if (request.nextUrl.pathname.startsWith("/painel")) {
        return handlePainel(request, accessToken, refreshToken)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}

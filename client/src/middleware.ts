import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function tryRefreshAccessToken(refreshToken: string): Promise<string | null> {
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
        return data?.results?.accessToken ?? null
    } catch {
        return null
    }
}

export async function middleware(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value

    const isPainel = request.nextUrl.pathname.startsWith("/painel")

    if (!isPainel) {
        return NextResponse.next()
    }

    if (accessToken) {
        return NextResponse.next()
    }

    if (refreshToken) {
        const newAccessToken = await tryRefreshAccessToken(refreshToken)

        if (newAccessToken) {
            const response = NextResponse.next()

            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            })

            return response
        }
    }
    return NextResponse.redirect(
        new URL("/acessar", request.url)
    )
}

export const config = {
    matcher: ["/painel/:path*"]
}
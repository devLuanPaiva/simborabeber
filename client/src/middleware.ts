import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

    const token = request.cookies.get("accessToken")?.value

    const isPainel = request.nextUrl.pathname.startsWith("/painel")

    if (isPainel && !token) {

        return NextResponse.redirect(
            new URL("/acessar", request.url)
        )

    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/painel/:path*"]
}
"use server"
import { cookies } from "next/headers"

export async function refreshToken() {

    const cookieStore = await cookies()

    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken) return null

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken
        })
    })

    if (!response.ok) {
        return null
    }

    const data = await response.json()

    const newAccessToken = data.results.accessToken
    const newRefreshToken = data.results.refreshToken

    cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
    })

    cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    return newAccessToken
}
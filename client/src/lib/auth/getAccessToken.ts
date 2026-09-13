"use server"
import { cookies } from "next/headers"

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("accessToken")?.value
}

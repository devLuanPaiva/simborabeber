import { cookies } from "next/headers"
import { refreshToken } from "../auth/refreshToken"

export async function serverDelete(
    url: string,
    options: RequestInit = {}
) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const base_url = process.env.NEXT_PUBLIC_BASE_URL

    const doRequest = async (token?: string) => {
        return fetch(`${base_url}${url}`, {
            method: "DELETE",
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...(options.headers || {})
            },
        })
    }
    let response = await doRequest(accessToken)

    if (response.status !== 401) {
        return response
    }
    const newAccessToken = await refreshToken()
    if (!newAccessToken) {
        return response
    }
    response = await doRequest(newAccessToken)
    return response

}
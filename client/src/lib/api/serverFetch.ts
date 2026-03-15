import { cookies } from "next/headers"
import { refreshToken } from "../auth/refreshToken"

export async function serverFetch(
    url: string,
    options: RequestInit = {}
) {

    const cookieStore = await cookies()

    let accessToken = cookieStore.get("accessToken")?.value

    const doRequest = async (token?: string) => {

        return fetch(`${process.env.API_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...(options.headers || {})
            }
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
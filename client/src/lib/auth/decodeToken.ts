import { IJwtPayload } from "@/data/types"

export function decodeToken(token: string): IJwtPayload {
    const payload = token.split('.')[1]

    const decoded = Buffer
        .from(payload, "base64")
        .toString()

    return JSON.parse(decoded)
}
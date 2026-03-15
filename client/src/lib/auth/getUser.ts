import { IJwtPayload } from "@/data/types"
import { cookies } from "next/headers"
import { decodeToken } from "./decodeToken"

export async function getUser(): Promise<IJwtPayload | null> {
  const cookieStore = await cookies()

  const token = cookieStore.get("accessToken")?.value

  if (!token) return null

  try {
    return decodeToken(token)
  } catch {
    return null
  }
}
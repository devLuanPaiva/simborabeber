"use server"
import { IJwtPayload } from "@/data/types"
import { cookies } from "next/headers"
import { decodeToken } from "./decodeToken"

export async function getUser(): Promise<IJwtPayload> {
  const cookieStore = await cookies()

  const token = cookieStore.get("accessToken")?.value
  return decodeToken(token || "")
}
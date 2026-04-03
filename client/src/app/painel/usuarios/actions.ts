"use server";

import { IUser } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";

export async function getUsers() {
    const response = await serverFetch("/users", {
        method: "GET",
        cache: "force-cache",
        next: { revalidate: 3060 },
    })

    const data: ApiResponse<IUser[]> = await response.json()

    return data.results ?? []
}
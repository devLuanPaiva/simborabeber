"use server";

import { getFormStringValue } from "@/data/helpers";
import { IUser, UserRole } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverDelete } from "@/lib/api/serverDelete";
import { serverFetch } from "@/lib/api/serverFetch";
import { serverPatch } from "@/lib/api/serverPatch";
import { serverPost } from "@/lib/api/serverPost";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const response = await serverFetch("/user", {
        method: "GET",
        cache: "force-cache",
        next: { revalidate: 3060 },
    });

    if (response.status === 404) {
        return [];
    }

    const data: ApiResponse<IUser[]> = await response.json();

    return data.results ?? [];
}

export async function createUser(formData: FormData) {
    const name = getFormStringValue(formData, "name").trim();
    const email = getFormStringValue(formData, "email").trim();
    const password = getFormStringValue(formData, "password");
    const role = getFormStringValue(formData, "role").trim();
    const barId = getFormStringValue(formData, "barId").trim();

    if (!name || !email || !password || !role) {
        return { success: false, error: "Preencha nome, e-mail, senha e cargo" };
    }

    const payload: Partial<IUser> & { password: string; barId?: string } = {
        name,
        email,
        password,
        role: role as UserRole,
        ...(barId ? { barId } : {}),
    };

    try {
        const response = await serverPost("/user", payload);
        const body: ApiResponse<IUser> = await response.json().catch(() => ({} as ApiResponse<IUser>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao criar usuário" };
        }

        revalidatePath("/painel/usuarios");
        return { success: true, message: "Usuário criado com sucesso" };
    } catch (err) {
        console.error("Error creating user:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function updateUser(id: string, formData: FormData) {
    const payload: Partial<IUser> & { password?: string; barId?: string } = {};

    const name = getFormStringValue(formData, "name").trim();
    if (name) payload.name = name;

    const email = getFormStringValue(formData, "email").trim();
    if (email) payload.email = email;

    const password = getFormStringValue(formData, "password");
    if (password) payload.password = password;

    const role = getFormStringValue(formData, "role").trim();
    if (role) payload.role = role as UserRole;

    const barId = getFormStringValue(formData, "barId").trim();
    if (barId) payload.barId = barId;

    try {
        const response = await serverPatch(`/user/${id}`, payload);
        const body: ApiResponse<IUser> = await response.json().catch(() => ({} as ApiResponse<IUser>));

        if (!response.ok) {
            return { success: false, error: body.errors?.detail || "Erro ao atualizar usuário" };
        }

        revalidatePath("/painel/usuarios");
        return { success: true, message: "Usuário atualizado com sucesso" };
    } catch (err) {
        console.error("Error updating user:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function toggleUserStatus(id: string) {
    try {
        const response = await serverPatch(`/user/${id}/toggle-status`, {});
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao alterar status" };
        }

        revalidatePath("/painel/usuarios");
        return { success: true, message: "Status atualizado" };
    } catch (err) {
        console.error("Error toggling user status:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

export async function deleteUser(id: string) {
    try {
        const response = await serverDelete(`/user/${id}`);
        const body = await response.json().catch(() => ({} as ApiResponse<unknown>));

        if (!response.ok) {
            return { success: false, error: body?.errors?.detail || "Erro ao remover usuário" };
        }

        revalidatePath("/painel/usuarios");
        return { success: true, message: "Usuário removido" };
    } catch (err) {
        console.error("Error deleting user:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

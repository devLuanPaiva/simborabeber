"use server"
import { serverPatch } from "@/lib/api/serverPatch";
import { revalidatePath } from "next/cache";

export interface DeliverySettingsInput {
    comandasEnabled: boolean;
    deliveryEnabled: boolean;
    deliveryFee: number;
    minOrderValue: number;
    deliveryOriginAddress?: string;
    openingHours?: string;
    deliveryCities: { name: string; fee: number }[];
}

export async function updateDeliverySettings(barId: string, slug: string, data: DeliverySettingsInput) {
    try {
        const response = await serverPatch(`/bar/${barId}`, data);
        const json = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: json?.errors?.detail || json?.message || "Erro ao atualizar configurações",
            };
        }

        revalidatePath(`/painel/bar/${slug}/configuracoes`);
        revalidatePath(`/painel/bar/${slug}`);

        return { success: true };
    } catch (err) {
        console.error("Error updating delivery settings:", err);
        return { success: false, error: "Erro inesperado" };
    }
}

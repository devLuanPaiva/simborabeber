"use server"
import { serverPost } from "@/lib/api/serverPost";
import { getFormStringValue } from "@/data/helpers";
import { OrderType, ICartItem } from "@/data/models";

export async function createOrder(formData: FormData, slug: string) {
    try {
        const type = getFormStringValue(formData, "type") as OrderType;
        const customerName = getFormStringValue(formData, "customerName").trim();
        const customerPhone = getFormStringValue(formData, "customerPhone").replace(/\D/g, "");
        const deliveryAddress = getFormStringValue(formData, "deliveryAddress").trim();
        const paymentMethod = getFormStringValue(formData, "paymentMethod");
        const notes = getFormStringValue(formData, "notes").trim();
        const itemsRaw = getFormStringValue(formData, "items");

        let items: ICartItem[] = [];
        try {
            items = JSON.parse(itemsRaw || "[]");
        } catch {
            return { success: false, error: "Carrinho inválido, volte e tente novamente" };
        }

        if (!customerName || !customerPhone || !paymentMethod || items.length === 0) {
            return { success: false, error: "Preencha todos os campos obrigatórios" };
        }

        if (type === OrderType.DELIVERY && !deliveryAddress) {
            return { success: false, error: "Endereço é obrigatório para entrega" };
        }

        const response = await serverPost(`/order/by-bar/${slug}`, {
            type,
            customerName,
            customerPhone,
            ...(type === OrderType.DELIVERY ? { deliveryAddress } : {}),
            paymentMethod,
            ...(notes ? { notes } : {}),
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                ...(item.notes ? { notes: item.notes } : {}),
                ...(item.variantId ? { variantId: item.variantId } : {}),
                ...(item.extraProductId ? { extraProductId: item.extraProductId } : {}),
                ...(item.addonIds?.length ? { addonIds: item.addonIds } : {}),
            })),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data?.errors?.detail || data?.message || "Erro ao criar pedido",
            };
        }

        return { success: true, orderId: data?.results?.id as string };
    } catch (err) {
        console.error("Error creating order:", err);
        return { success: false, error: "Erro inesperado ao criar pedido" };
    }
}

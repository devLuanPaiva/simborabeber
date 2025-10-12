import { IShoppingCartItem } from "./ITable";

export enum DeliveryStatus {
    PENDING = "Pending",
    IN_PROGRESS = "In Progress",
    DELIVERED = "Delivered",
    CANCELED = "Canceled",
}
export const DeliveryStatusLabels: Record<DeliveryStatus, string> = {
    [DeliveryStatus.PENDING]: "Pendente",
    [DeliveryStatus.IN_PROGRESS]: "Em Progresso",
    [DeliveryStatus.DELIVERED]: "Entregue",
    [DeliveryStatus.CANCELED]: "Cancelado",
}

export enum PaymentMethod {
    CASH = "Cash",
    CREDIT_CARD = "Credit Card",
    DEBIT_CARD = "Debit Card",
    PIX = "Pix",
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Dinheiro",
    [PaymentMethod.CREDIT_CARD]: "Cartão de Crédito",
    [PaymentMethod.DEBIT_CARD]: "Cartão de Débito",
    [PaymentMethod.PIX]: "Pix",
}

export interface IDelivery {
    id: string;
    customerName: string;
    customerPhone: string;
    address: string;
    status: DeliveryStatus;
    paymentMethod: PaymentMethod;
    changeOfMoney?: number;
    items: IShoppingCartItem[]
    totalAmount: number;
}
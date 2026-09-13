import { ProductCategory } from "./IProduct";

export enum OrderType {
    DELIVERY = 'delivery',
    PICKUP = 'pickup',
}

export const OrderTypeLabels: Record<OrderType, string> = {
    [OrderType.DELIVERY]: 'Entrega',
    [OrderType.PICKUP]: 'Retirada',
}

export enum OrderStatus {
    RECEIVED = 'received',
    PREPARING = 'preparing',
    READY = 'ready',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.RECEIVED]: 'Recebido',
    [OrderStatus.PREPARING]: 'Preparando',
    [OrderStatus.READY]: 'Pronto',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Saiu para entrega',
    [OrderStatus.COMPLETED]: 'Concluído',
    [OrderStatus.CANCELLED]: 'Cancelado',
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    PIX = 'pix',
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.CARD]: 'Cartão',
    [PaymentMethod.PIX]: 'Pix',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
}

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    category: ProductCategory;
    image?: string;
}

export interface IOrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    category: ProductCategory;
}

export interface IOrder {
    id: string;
    type: OrderType;
    status: OrderStatus;
    customerName: string;
    customerPhone: string;
    deliveryAddress?: string;
    deliveryFee: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes?: string;
    totalValue: number;
    items: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
    readyAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
}

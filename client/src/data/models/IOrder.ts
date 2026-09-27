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

export interface ICartItemAddon {
    id: string;
    name: string;
    price: number;
}

export interface ICartItemSizeOption {
    id: string;
    label: string;
    price: number;
}

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    category: ProductCategory;
    image?: string;
    variantId?: string;
    variantLabel?: string;
    extraProductId?: string;
    extraProductName?: string;
    addonIds?: string[];
    addonsSnapshot?: ICartItemAddon[];
    /**
     * Present only while the size hasn't been chosen yet (quick-add from the
     * listing skips size selection - it's finished later in the cart). Once
     * a size is set via SET_VARIANT, this is cleared.
     */
    sizeOptions?: ICartItemSizeOption[];
}

export interface IOrderItemComponent {
    productName: string;
    variantLabel?: string | null;
    price: number;
}

export interface IOrderItemAddon {
    name: string;
    price: number;
}

export interface IOrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    category: ProductCategory;
    components?: IOrderItemComponent[];
    addons?: IOrderItemAddon[];
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

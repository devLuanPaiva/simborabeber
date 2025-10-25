import { IEstablishment, IEstablishmentProduct } from "./IEstablishment";

export interface ISale {
    id: string;
    createdAt: Date;
    totalAmount: number;
    paymentMethod: string;
    tableId?: string | null;
    establishmentId: string;
    waiterId?: string | null;
    closedAt?: Date | null;

    // Relations
    establishment?: IEstablishment;
    items?: ISaleItem[];
}

export interface ISaleItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    saleId: string;
    establishmentProductId?: string | null;

    // Relations
    sale?: ISale;
    establishmentProduct?: IEstablishmentProduct | null;
}
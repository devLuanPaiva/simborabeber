import { IEstablishment, IEstablishmentProduct } from "./IEstablishment";

export interface ITable {
    id: string;
    number: number;
    isAvailable: boolean;
    createdAt: Date;
    establishmentId: string;
    establishment?: IEstablishment;
    shoppingCarts?: IShoppingCart[];
}

export interface IShoppingCart {
    id: string;
    createdAt: Date;
    isActive: boolean;
    openedAt?: Date | null;
    closedAt?: Date | null;
    totalAmount?: number | null;
    establishmentId: string;
    tableId?: string | null;

    // Relations
    establishment?: IEstablishment;
    table?: ITable | null;
    items?: IShoppingCartItem[];
}

export interface IShoppingCartItem {
    id: string;
    establishmentProductId: string;
    unitPrice: number;
    totalPrice: number;
    productName: string;
    quantity: number;
    cartId: string;

    // Relations
    establishmentProduct?: IEstablishmentProduct;
    cart?: IShoppingCart;
}

export interface ITable {
    id: string;
    number: number;
    isAvailable: boolean;
    shoppingCart?: ITableShoppingCart;
}

export interface ITableShoppingCart {
    id: string;
    tableId: string;
    isClosed: boolean;
    openedAt: Date;
    closedAt?: Date;
    totalAmount?: number;
    items?: IShoppingCartItem[];
}

export interface IShoppingCartItem {
    id: string;
    shoppingCartId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
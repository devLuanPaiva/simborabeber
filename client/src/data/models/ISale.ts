import { IShoppingCartItem } from "./ITable";

export interface ISale {
    id: string;
    establishmentId: string;
    items: IShoppingCartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
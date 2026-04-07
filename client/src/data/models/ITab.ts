import { IUser } from "./IUser";
import { ProductCategory } from "./IProduct";

export enum TabStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export const TabStatusLabels: Record<TabStatus, string> = {
    [TabStatus.OPEN]: 'Aberta',
    [TabStatus.CLOSED]: 'Fechada',
}

export interface ITab {
    id: string;
    status: TabStatus;
    tableNumber?: number;
    customerName?: string;
    totalValue: number;
    waiterOpen: Partial<IUser>
    waiterClosed?: Partial<IUser>;
    items: ITabItem[];
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
}

export interface ITabItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    waiterAdded: Partial<IUser>;
    createdAt: Date;
    updatedAt: Date;
    category: ProductCategory;
}
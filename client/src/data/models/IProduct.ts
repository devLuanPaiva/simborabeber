
import { IEstablishment, IEstablishmentProduct } from "./IEstablishment";

export enum ProductCategory {
    COLDDRINKS = "Cold Drinks",
    HOTDRINKS = "Hot Drinks",
    PORTIONS = "Portions",
    BARBECUE = "Barbecue",
    LUNCHES = "Lunches",
    OTHERS = "Others",
}

export const ProductCategoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.COLDDRINKS]: "Bebidas Frias",
    [ProductCategory.HOTDRINKS]: "Bebidas Quentes",
    [ProductCategory.PORTIONS]: "Porções",
    [ProductCategory.BARBECUE]: "Churrasco",
    [ProductCategory.LUNCHES]: "Almoços",
    [ProductCategory.OTHERS]: "Outros",
}

export interface IProduct {
    id: string;
    name: string;
    description?: string | null;
    salePrice: number;
    purchasePrice?: number | null;
    category: ProductCategory;
    imageUrl?: string | null;
    createdAt: Date;
    barCode?: string | null;
    showInMenu: boolean;
    isActive: boolean;

    // Relations
    establishmentProducts?: IEstablishmentProduct[];
    productStocks?: IProductStock[];
}


export interface IProductStock {
    id: string;
    establishmentId: string;
    productId: string;
    quantity: number;
    updatedAt: Date;

    // Relations
    establishment?: IEstablishment;
    product?: IProduct;
}


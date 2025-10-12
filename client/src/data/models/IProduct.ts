export enum ProductCategory {
    COLDDRINKS = "Cold Drinks",
    HOTDRINKS = "Hot Drinks",
    PORTIONS = "Portions",
    BARBECUE = "Barbecue",
    LUNCHES = "Lunches",
    OTHERS = "Others",
}

export const ProductCategoryLabels: { [key in ProductCategory]: string } = {
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
    description?: string;
    salePrice: number;
    purchasePrice?: number;
    imageUrl?: string;
    category: ProductCategory;


    hasStockControl: boolean;
    quantityInStock?: number;
    minimumStockQuantity?: number;
    barCode?: string;

    showInMenu: boolean;
    isAvailable?: boolean;
}

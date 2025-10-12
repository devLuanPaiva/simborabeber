export enum ProductCategory {
    COLDDRINKS = "Cold Drinks",
    HOTDRINKS = "Hot Drinks",
    PORTIONS = "Portions",
    BARBECUE = "Barbecue",
    LUNCHES = "Lunches",
    OTHERS = "Others",
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

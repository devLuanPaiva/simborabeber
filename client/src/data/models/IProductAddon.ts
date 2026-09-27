import { ProductCategory } from "./IProduct";

export interface IProductAddon {
    id: string;
    name: string;
    price: number;
    category?: ProductCategory;
    isActive: boolean;
}

import { ApiResponse } from "../hooks";
import { IProduct, IProductStock } from "./IProduct";
import { ISale, ISaleItem } from "./ISale";
import { IShoppingCart, IShoppingCartItem, ITable } from "./ITable";
import { IUser } from "./IUser";


export enum EstablishmentType {
    SNACK_BARS = "SNACK_BARS",
    RESTAURANTS = "RESTAURANTS",
    STEAKHOUSES = "STEAKHOUSES",
    BARS = "BARS",
    ICE_CREAM_PARLORS = "ICE_CREAM_PARLORS",
    PIZZARIAS = "PIZZARIAS",
}

export const EstablishmentTypeLabels: Record<EstablishmentType, string> = {
    [EstablishmentType.SNACK_BARS]: "Lanchonetes",
    [EstablishmentType.RESTAURANTS]: "Restaurantes",
    [EstablishmentType.STEAKHOUSES]: "Churrascarias",
    [EstablishmentType.BARS]: "Bares",
    [EstablishmentType.ICE_CREAM_PARLORS]: "Sorveterias",
    [EstablishmentType.PIZZARIAS]: "Pizzarias",
}
export interface IEstablishment {
    id: string;
    email: string;
    name: string;
    type: EstablishmentType;
    address: string;
    phone: string;
    slug: string;
    createdAt: Date;
    isActive: boolean;

    users?: IUser[];
    establishmentProducts?: IEstablishmentProduct[];
    tables?: ITable[];
    sales?: ISale[];
    productStocks?: IProductStock[];
    shoppingCarts?: IShoppingCart[];
}

export interface IEstablishmentProduct {
    id: string;
    establishmentId: string;
    productId: string;
    localCode?: string | null;
    price: number;
    trackInventory: boolean;
    available: boolean;
    createdAt: Date;
    establishment?: IEstablishment;
    product?: IProduct;
    shoppingCartItems?: IShoppingCartItem[];
    saleItems?: ISaleItem[];
}


export interface IEstablishmentContextProps {
    getEstablishmentsByUser: () => Promise<ApiResponse<IEstablishment[]>>;
    createEstablishment: (establishmentData: Partial<IEstablishment>) => Promise<ApiResponse<IEstablishment>>;
    updateEstablishment: (id: string, establishmentData: Partial<IEstablishment>) => Promise<ApiResponse<IEstablishment>>;
    deleteEstablishment: (id: string) => Promise<ApiResponse<null>>;
}
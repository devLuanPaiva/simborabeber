import { IProduct } from "./IProduct";
import { ISale } from "./ISale";
import { ITable } from "./ITable";
import { IUser } from "./IUser";

export interface IEstablishment {
    id: string;
    name: string;
    isActive: boolean;
    users: IUser[];
    sales: ISale[];
    createdAt: Date;
    updatedAt: Date;
    products: IProduct[];
    tables: ITable[];

}
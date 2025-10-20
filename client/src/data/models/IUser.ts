import { ApiResponse } from "../hooks";
import { IEstablishment } from "./IEstablishment";

export enum UserRole {
    WAITER = "WAITER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN"
}
export const UserRolesLabels: Record<UserRole, string> = {
    [UserRole.WAITER]: "Garçom",
    [UserRole.MANAGER]: "Gerente",
    [UserRole.ADMIN]: "Administrador"
};
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    isActive: boolean;
    establishmentId?: string;
    establishment?: IEstablishment | null;
}

export interface ITokenPayload extends Partial<IUser> {
    exp: number;
    iat: number;
    type: "access" | "refresh";
}


export interface IUserContextProps {
    createUser: (user: Partial<IUser>) => Promise<ApiResponse<IUser>>;
    updateUser: (id: string, user: Partial<IUser>) => Promise<ApiResponse<IUser>>;
    deleteUser: (id: string) => Promise<ApiResponse<null>>;
    getUserById: (id: string) => Promise<ApiResponse<IUser>>;
    getUsers: () => Promise<ApiResponse<IUser[]>>;
    getCurrentUser: () => Partial<IUser | null>;
}
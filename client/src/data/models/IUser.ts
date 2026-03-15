

export enum UserRole {
    WAITER = "waiter",
    MANAGER = "manager",
    ADMIN = "admin"
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
}

export interface ITokenPayload extends Partial<IUser> {
    exp: number;
    iat: number;
    type: "access" | "refresh";
}


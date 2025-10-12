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
export interface IUser{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    establishmentId: string;
}
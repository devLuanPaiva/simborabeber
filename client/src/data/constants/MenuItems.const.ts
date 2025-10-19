import { Clock, Flame, LayoutDashboard, Package, Settings, ShoppingBag, TrendingUp, Users, UtensilsCrossed } from "lucide-react";

export interface IMenuItems {
    id: string;
    href: string;
    label: string;
    icon: React.ElementType;
}
export const waiterMenuItems: IMenuItems[] = [
    {
        id: "tables",
        href: '/admin/mesas',
        label: "Mesas",
        icon: UtensilsCrossed
    },
    {
        id: "orders",
        href: '/admin/pedidos',
        label: "Pedidos em Andamento",
        icon: Flame
    },
    {
        id: "history",
        href: '/admin/historico',
        label: "Histórico",
        icon: Clock
    },
];

export const managerMenuItems: IMenuItems[] = [
    {
        id: "dashboard",
        href: '/admin/dashboard',
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        id: "products",
        href: '/admin/produtos',
        label: "Produtos",
        icon: ShoppingBag
    },
    {
        id: "stock",
        href: '/admin/estoque',
        label: "Estoque",
        icon: Package
    },
    {
        id: "sales",
        href: '/admin/vendas',
        label: "Vendas",
        icon: TrendingUp
    },
    {
        id: "employees",
        href: '/admin/funcionarios',
        label: "Funcionários",
        icon: Users
    },
    {
        id: "settings",
        href: '/admin/configuracoes',
        label: "Configurações",
        icon: Settings
    },
];

export const adminMenuItems: IMenuItems[] = [
    {
        id: "dashboard",
        href: '/admin/dashboard',
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        id: "users",
        href: '/admin/usuarios',
        label: "Usuários",
        icon: Users
    }
]
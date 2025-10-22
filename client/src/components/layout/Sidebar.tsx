"use client";
import {
  adminMenuItems,
  IMenuItems,
  managerMenuItems,
  waiterMenuItems,
} from "@/data/constants";
import { IUser, UserRole, UserRolesLabels } from "@/data/models";
import { cn } from "@/lib/utils";
import { Flame, LogOut, MenuIcon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentUser: IUser | null;
  onLogout: () => void;
}
export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  onLogout,
}: Readonly<SidebarProps>) {
  const [menuItems, setMenuItems] = useState<IMenuItems[]>([]);
  const [themeColor, setThemeColor] = useState<
    "text-secondary" | "text-primary"
  >("text-secondary");
  const pathname = usePathname() || "";

  const setMenuItemsByUserRole = useCallback(() => {
    switch (currentUser?.role) {
      case UserRole.ADMIN:
        setMenuItems(adminMenuItems);
        setThemeColor("text-secondary");
        break;
      case UserRole.MANAGER:
        setMenuItems(managerMenuItems);
        setThemeColor("text-secondary");
        break;
      case UserRole.WAITER:
        setMenuItems(waiterMenuItems);
        setThemeColor("text-primary");
        break;
      default:
        setMenuItems([]);
        break;
    }
  }, [currentUser]);

  useEffect(() => {
    setMenuItemsByUserRole();
  }, [setMenuItemsByUserRole]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Flame className={cn("h-6 w-6", themeColor)} />
              <span className="font-bebas tracking-wide">Fogo & Brasa</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="p-4 border-b">
          {sidebarOpen ? (
            <div>
              <p className="truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {UserRolesLabels[currentUser?.role || UserRole.WAITER]}
              </p>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs">{currentUser?.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setSidebarOpen(false);
                }}
                aria-current={active ? "page" : undefined}
                className={`${
                  active
                    ? `bg-accent/50 font-medium ${themeColor}`
                    : "text-gray-700 hover:bg-gray-50"
                } group flex items-center px-2 py-2 text-sm rounded-md w-full text-left`}
              >
                <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-destructive hover:text-destructive",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}

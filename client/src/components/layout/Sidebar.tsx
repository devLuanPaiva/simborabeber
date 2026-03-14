"use client";
import {
  adminMenuItems,
  IMenuItems,
  managerMenuItems,
  waiterMenuItems,
} from "@/data/constants";
import { IUser, UserRole } from "@/data/models";
import { cn } from "@/lib/utils";
import { Flame, LogOut, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

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
  const route = useRouter();

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

  const onNavigate = (href: string) => {
    route.push(href);
  };

  return (
    <aside>
      <div className="hidden md:flex md:flex-shrink-0 h-screen bg-card">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto  border-r">
            <div className="p-4 border-b flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <Flame className={cn("h-6 w-6", themeColor)} />
                  <h2 className="font-bebas tracking-wide">Fogo & Brasa</h2>
                </div>
              )}
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Button
                      key={item.id}
                      variant={active ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 cursor-pointer",
                        !sidebarOpen && "justify-center px-2"
                      )}
                      onClick={() => onNavigate(item.id)}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive cursor-pointer",
                !sidebarOpen && "justify-center px-2"
              )}
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden bg-card"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-zinc-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu lateral clicando fora"
            tabIndex={0}
          />
          <div
            className={cn(
              "relative flex-1 flex flex-col max-w-xs w-full",
              themeColor
            )}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu lateral clicando no botão"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white cursor-pointer"
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto  border-r">
              <div className="p-4 border-b flex items-center justify-between">
                {sidebarOpen && (
                  <div className="flex items-center gap-2">
                    <Flame className={cn("h-6 w-6", themeColor)} />
                    <span className="font-bebas tracking-wide">
                      Fogo & Brasa
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Button
                        key={item.id}
                        variant={active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 cursor-pointer",
                          !sidebarOpen && "justify-center px-2"
                        )}
                        onClick={() => onNavigate(item.id)}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-destructive hover:text-destructive cursor-pointer",
                  !sidebarOpen && "justify-center px-2"
                )}
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>Sair</span>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

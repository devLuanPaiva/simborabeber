"use client";

import { useAuth } from "@/data/contexts";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, MenuIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { IUser } from "@/data/models";
import { Sidebar } from "./Sidebar";


export function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth()

    return (
        <div className="flex h-screen bg-background">

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentUser={user as IUser}
                onLogout={logout}
            />

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="relative z-10 flex-shrink-0">
                    <button
                        aria-label="Abrir menu lateral clicando no botão"
                        type="button"
                        name="Abrir menu lateral clicando no botão"
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 border-r border-zinc-200 text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                    >
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6 ">{children}</div>
                </main>
            </div>
        </div>
    );
}
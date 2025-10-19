"use client";

import { useAuth } from "@/data/contexts";
import { useState } from "react";
import { Button } from "../ui/button";
import { MenuIcon, } from "lucide-react";
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

            <div
                className={cn(
                    "transition-all duration-300",
                    sidebarOpen ? "md:ml-64" : "md:ml-20"
                )}
            >
                <div className="md:hidden p-4 border-b bg-card sticky top-0 z-40">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <MenuIcon className="h-5 w-5" />
                    </Button>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
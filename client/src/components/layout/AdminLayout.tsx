"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { IUser } from "@/data/models";
import { Sidebar } from "./Sidebar";

export function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        
      /> */}

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

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/logout";

interface UserMenuProps {
  user?: {
    name?: string;
    image?: string;
    role?: string;
  };
}

export default function UserMenu({ user }: Readonly<UserMenuProps>) {
  const router = useRouter();

  const handleLogout = async () => await logout().then(() => router.push("/"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user?.name ?? "User"} />
            ) : (
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-zinc-500">{user?.role}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

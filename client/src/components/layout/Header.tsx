"use server";
import { IBar, UserRole, UserRolesLabels } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { getUser } from "@/lib/auth/getUser";
import { UtensilsCrossed } from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";
import Image from "next/image";

interface HeaderProps {
  slug_bar: string;
}

export async function Header({ slug_bar }: Readonly<HeaderProps>) {
  const user = await getUser();

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const response_bar = await fetch(`${base_url}/bar/${slug_bar}`, {
    cache: "force-cache",
    next: {
      revalidate: 60,
    },
  });

  const data_bar: ApiResponse<IBar> = await response_bar.json();
  const bar = data_bar.results;

  return (
    <header className="w-full bg-white border-b border-[#BFAE99]/20  py-4 ">
      <div className="w-11/12 mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2A20C] flex items-center justify-center text-white">
            {bar?.image ? (
              <Image
                src={bar.image}
                alt={bar.name}
                fill
                className="object-cover"
                loading="eager"
              />
            ) : (
              <UtensilsCrossed size={20} />
            )}
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-zinc-800">{bar?.name ?? "Bar"}</p>
            <p className="text-xs text-zinc-500">/{bar?.slug}</p>
          </div>
        </div>
        <div>
          <UserMenu
            user={{
              name: user?.name,
              image: undefined,
              role: UserRolesLabels[user?.role as UserRole],
            }}
          />
        </div>
      </div>
    </header>
  );
}

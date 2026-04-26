"use server";
import { UserRole, UserRolesLabels } from "@/data/models";
import { getUser } from "@/lib/auth/getUser";
import { UtensilsCrossed } from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";
import Image from "next/image";
import { getBarBySlug } from "@/actions";

interface HeaderProps {
  slug_bar: string;
}

export async function Header({ slug_bar }: Readonly<HeaderProps>) {
  const user = await getUser();
  const bar = await getBarBySlug(slug_bar);

  return (
    <header className="w-full bg-white border-b border-[#BFAE99]/20  py-4 ">
      <div className="w-11/12 mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2A20C] flex items-center justify-center text-white">
            {bar?.image ? (
              <Image
                src={bar.image}
                alt={bar.name}
                height={100}
                width={100}
                className="object-cover w-full h-full"
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

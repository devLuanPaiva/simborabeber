import { IBar, UserRole, UserRolesLabels } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { getUser } from "@/lib/auth/getUser";
import { UtensilsCrossed, User } from "lucide-react";
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
    <header className="w-full bg-white border-b border-[#BFAE99]/20 px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2A20C] flex items-center justify-center text-white">

          {bar?.image ? (
            <Image
              src={bar.image}
              alt={bar.name}
              fill
              className="object-cover"
            />
          ) : (
            <UtensilsCrossed size={20} />
          )}

        </div>

        <div className="leading-tight">

          <p className="font-semibold text-zinc-800">
            {bar?.name ?? "Bar"}
          </p>

          <p className="text-xs text-zinc-500">
            /{bar?.slug}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <div className="bg-[#F2F2F2] p-2 rounded-full">
          <User size={18} />
        </div>

        <div className="text-right leading-tight">

          <p className="text-sm font-semibold text-zinc-800">
            {user?.name}
          </p>

          <p className="text-xs text-zinc-500">
            {UserRolesLabels[user?.role as UserRole]}
          </p>

        </div>

      </div>

    </header>
  );
}
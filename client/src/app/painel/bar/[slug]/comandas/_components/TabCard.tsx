import { ITab, TabStatus, TabStatusLabels } from "@/data/models/ITab";
import Link from "next/link";
import { Users, Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/data/functions";

interface TabCardProps {
  tab: ITab;
  slug: string;
}

export function TabCard({ tab, slug }: Readonly<TabCardProps>) {
  const isOpen = tab.status === TabStatus.OPEN;

  return (
    <Link href={`/painel/bar/${slug}/comanda/${tab.id}`} className="block">
      <div className="bg-white rounded-xl border border-[#BFAE99]/20 shadow-sm p-4 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-zinc-200 text-zinc-600"
            }`}
          >
            {TabStatusLabels[tab.status]}
          </span>

          <span className="text-xs text-zinc-500">
            {formatDate(tab.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-700 mb-2">
          <Users size={16} />
          Mesa {tab.tableNumber ?? "-"}
        </div>

        <p className="font-semibold text-zinc-800">
          {tab.customerName ?? "Cliente"}
        </p>

        <div className="flex items-center gap-2 mt-3 text-[#F28B0C] font-bold">
          <Receipt size={16} />
          {formatCurrency(tab.totalValue)}
        </div>
      </div>
    </Link>
  );
}

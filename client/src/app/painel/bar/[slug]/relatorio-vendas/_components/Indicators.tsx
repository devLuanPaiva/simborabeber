import { ISalesIndicators } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { appToast } from "@/utils/toast-ui";
import { formatCurrency } from "@/data/functions";
import { DollarSign, TrendingUp, Receipt, Users, Clock } from "lucide-react";

export async function Indicators() {
  const response = await serverFetch("/reports/sales-indicators");
  const data: ApiResponse<ISalesIndicators> = await response.json();

  if (data.errors) {
    appToast.error(data.errors.detail || "Erro ao obter indicadores de vendas");
  }

  const indicators = data.results;

  const cards = [
    {
      label: "Faturamento Total",
      value: formatCurrency(Number(indicators.totalRevenue)),
      icon: DollarSign,
    },
    {
      label: "Faturamento Hoje",
      value: formatCurrency(Number(indicators.todayRevenue)),
      icon: TrendingUp,
    },
    {
      label: "Ticket Médio",
      value: formatCurrency(Number(indicators.averageTicketValue)),
      icon: Receipt,
    },
    {
      label: "Comandas Abertas",
      value: indicators.openedTabsCount,
      icon: Clock,
    },
    {
      label: "Comandas Fechadas",
      value: indicators.closedTabsCount,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index + 1}
            className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-[#F2BE5C]/30 text-[#F28B0C] p-2 rounded-lg">
                <Icon size={18} />
              </div>
            </div>

            <p className="text-sm text-zinc-500">{card.label}</p>

            <p className="text-xl font-bold text-[#F2A20C] mt-1">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

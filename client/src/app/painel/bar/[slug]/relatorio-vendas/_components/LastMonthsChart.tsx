"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { IMonthsSalesData } from "@/data/models";
import { formatCurrency } from "@/data/functions";

interface Props {
    data: IMonthsSalesData[];
}

const formatMonth = (month: number) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months[month] || "";
};

export function LastMonthsChart({ data }: Readonly<Props>) {
    const formattedData = data
        .map((item) => ({
            label: `${formatMonth(item.month)}/${String(item.year).slice(-2)}`,
            revenue: item.totalRevenue,
            sales: item.closedTabsCount,
            order: item.year * 100 + item.month,
        }))
        .sort((a, b) => a.order - b.order);

    return (
        <div className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
                Últimos 6 meses
            </h2>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="label" />

                        <YAxis
                            yAxisId="left"
                            tickFormatter={(v) => `R$${v}`}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                        />

                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "Faturamento") {
                                    return formatCurrency(Number(value));
                                }
                                return value;
                            }}
                        />

                        <Legend />

                        <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            name="Faturamento"
                            fill="#F28B0C"
                            radius={[6, 6, 0, 0]}
                        />

                        <Bar
                            yAxisId="right"
                            dataKey="sales"
                            name="Vendas"
                            fill="#F2BE5C"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
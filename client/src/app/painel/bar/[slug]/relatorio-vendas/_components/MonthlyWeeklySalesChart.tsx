"use client";

import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { IWeeksSalesData } from "@/data/models";
import { formatCurrency } from "@/data/functions";

interface Props {
    data: IWeeksSalesData[];
}

export function MonthlyWeeklySalesChart({ data }: Readonly<Props>) {
    const formattedData = data
        .map((item) => ({
            week: item.weekLabel || `Sem ${item.weekNumber}`,
            revenue: item.totalRevenue,
            sales: item.closedTabsCount,
            order: item.weekNumber,
        }))
        .sort((a, b) => a.order - b.order);

    return (
        <div className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
                Comparativo Semanal do Mês
            </h2>

            <div className="w-full h-75">
                <ResponsiveContainer>
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="week" />

                        <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => `R$${value}`}
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
                            yAxisId="right"
                            dataKey="sales"
                            name="Vendas"
                            radius={[6, 6, 0, 0]}
                            fill="#F2BE5C"
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Faturamento"
                            stroke="#F28B0C"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
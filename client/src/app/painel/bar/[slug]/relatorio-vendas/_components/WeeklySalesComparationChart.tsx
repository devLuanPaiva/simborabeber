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
import { IDaysSalesData } from "@/data/models";
import { formatCurrency } from "@/data/functions";

interface Props {
    data: IDaysSalesData[];
}

const weekOrder = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function normalizeDay(day: string) {
    if (day.toLowerCase().includes("domingo")) return "Dom";
    if (day.toLowerCase().includes("segunda")) return "Seg";
    if (day.toLowerCase().includes("terça")) return "Ter";
    if (day.toLowerCase().includes("quarta")) return "Qua";
    if (day.toLowerCase().includes("quinta")) return "Qui";
    if (day.toLowerCase().includes("sexta")) return "Sex";
    if (day.toLowerCase().includes("sábado")) return "Sáb";
    return day;
}

export function WeeklySalesComparationChart({ data }: Readonly<Props>) {
    const formattedData = data
        .map((item) => ({
            day: normalizeDay(item.dayOfWeek),
            revenue: item.totalRevenue,
            sales: item.closedTabsCount,
        }))
        .sort(
            (a, b) => weekOrder.indexOf(a.day) - weekOrder.indexOf(b.day)
        );

    return (
        <div className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
                Vendas da Semana
            </h2>

            <div className="w-full h-75">
                <ResponsiveContainer>
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => formatCurrency(Number(value))}
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
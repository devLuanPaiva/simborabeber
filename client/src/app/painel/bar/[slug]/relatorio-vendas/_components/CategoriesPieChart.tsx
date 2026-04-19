"use client";

import {
    PieChart,
    Pie,
    Cell,
    
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    ICategoryComparisonData,
    ProductCategoryLabels,
} from "@/data/models";
import { formatCurrency } from "@/data/functions";

interface Props {
    data: ICategoryComparisonData[];
}

const COLORS = [
    "#F2BE5C", 
    "#F2B24F",
    "#F2A742",
    "#F29C35",
    "#F28B0C", 
    "#E67E0B",
    "#CC6F0A", 
];

export function CategoriesPieChart({ data }: Readonly<Props>) {
    const formattedData = data.map((item) => ({
        name: ProductCategoryLabels[item.category],
        value: item.totalRevenue,
        count: item.totalCount,
        percentage: item.percentage,
    }));

    return (
        <div className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
                Vendas por Categoria
            </h2>

            <div className="w-full h-80">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={formattedData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            innerRadius={50}
                            paddingAngle={3}
                        >
                            {formattedData.map((_, index) => (
                                <Cell
                                    key={`cell-${index + 1}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, _name, props) => {
                                const payload = props.payload;
                                return [
                                    `${formatCurrency(Number(value))} • ${payload.percentage.toFixed(
                                        1
                                    )}%`,
                                    payload.name,
                                ];
                            }}
                        />

                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
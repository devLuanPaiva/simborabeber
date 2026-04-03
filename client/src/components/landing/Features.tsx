"use client";

import { motion } from "framer-motion";
import {
    ClipboardList,
    Smartphone,
    BarChart3,
    Beer,
} from "lucide-react";

const features = [
    {
        icon: ClipboardList,
        title: "Comandas digitais",
    },
    {
        icon: Smartphone,
        title: "Cardápio no celular",
    },
    {
        icon: BarChart3,
        title: "Relatórios de vendas",
    },
    {
        icon: Beer,
        title: "Gestão completa do bar",
    },
];

export function Features() {
    return (
            <div className="bg-white rounded-4xl p-4 md:p-10 md:shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {features.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center gap-4"
                            >
                                {/* Círculo com ícone */}
                                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F28B0C] text-white">
                                    <Icon size={32} />
                                </div>

                                {/* Texto */}
                                <p className="text-sm md:text-base font-semibold text-gray-800">
                                    {item.title}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
    

    );
}
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import step1 from "@/assets/garcom-01.png";
import step2 from "@/assets/garcom-02.png";
import step3 from "@/assets/garcom-03.png";
import step4 from "@/assets/garcom-04.png";

const steps = [
    {
        number: "1",
        image: step1,
        title: "Abra a comanda",
    },
    {
        number: "2",
        image: step2,
        title: "Adicione os itens",
    },
    {
        number: "3",
        image: step3,
        title: "Finalize a comanda",
    },
    {
        number: "4",
        image: step4,
        title: "Pronto! Venda concluída",
    },
];

export function HowItWorks() {
    return (
        <section className="w-11/12 max-w-7xl mx-auto ">
            <div className="text-center mb-12">
                <p className="text-sm font-semibold tracking-widest text-[#F28B0C] uppercase">
                    Como funciona
                </p>

                <h2 className="mt-4 text-3xl md:text-5xl font-bold text-zinc-800 max-w-3xl mx-auto">
                    Vender no <span className="text-[#DA5C07]">Simbora</span><span className="text-[#F28B0C]">Beber</span> é simples e rápido
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.number}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-zinc-50 shadow-2xl transition"
                    >
                        <span className="absolute top-4 left-5 text-4xl font-bold text-[#ac9e8c] opacity-40">
                            {step.number}
                        </span>

                        <div className="w-[200px] h-[172px] relative mb-4">
                            <Image
                                src={step.image}
                                alt={step.title}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <p className="text-base md:text-lg font-bold text-center text-zinc-800">
                            {step.title}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
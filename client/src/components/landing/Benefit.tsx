"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import benefitImg01 from "@/assets/benefit-01.png";

const benefits = [
  {
    title: "Simplicidade que acelera o atendimento",
    description:
      "Um sistema direto ao ponto, pensado para não atrapalhar o garçom. Abra comandas, adicione itens e finalize vendas em segundos.",
  },
  {
    title: "Funciona direto no celular",
    description:
      "Use o sistema no celular sem precisar de computador. Totalmente responsivo para acompanhar a correria do dia a dia do seu bar.",
  },
  {
    title: "Relatórios claros de vendas e lucros",
    description:
      "Acompanhe tudo que seu bar vendeu e entenda seus lucros com relatórios simples e objetivos.",
  },
];

export function Benefit() {
  return (
    <section className="w-full py-20">
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest text-[#F28B0C] uppercase">
            Benefícios
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-zinc-800 max-w-3xl mx-auto">
            Muito mais que um sistema de comandas
          </h2>
        </div>

        <div className="flex flex-col gap-20 justify-start items-center">
          {benefits.map((item, index) => {
            const isReverse = index % 2 !== 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={` flex flex-col md:flex-row items-center gap-10 ${
                  isReverse ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 flex justify-center">
                  <Image
                    src={benefitImg01}
                    alt={item.title}
                    className="w-[260px] sm:w-[320px] md:w-[400px] h-auto"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-lg text-[#BFAE99] max-w-md">
                    {item.description}
                  </p>

                  <div className="mt-6 w-16 h-1 bg-[#F28B0C] mx-auto md:mx-0 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

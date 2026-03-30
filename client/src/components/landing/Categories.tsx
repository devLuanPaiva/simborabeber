"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import espetinho from "@/assets/espetinho.png";
import barzinho from "@/assets/barzinho.png";
import churrascaria from "@/assets/churrascaria.png";

const categories = [
  {
    image: espetinho,
    title: "Espetinhos",
  },
  {
    image: barzinho,
    title: "Bares e Barzinhos",
  },
  {
    image: churrascaria,
    title: "Churrascarias",
  },
];

export function Categories() {
  return (
    <div className="w-11/12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-widest text-[#F28B0C] uppercase">
          Categorias
        </p>

        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-zinc-800 max-w-3xl mx-auto">
          Feito para diversos tipos de bares
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-8">
        {categories.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-40 h-40 relative mb-6">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

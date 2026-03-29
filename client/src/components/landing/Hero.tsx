"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import homemImg from "@/assets/homem-com-app.png";

export function Hero() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 pt-10">
      
      <div className="flex-1 text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-zinc-800"
        >
          Gestão inteligente para{" "}
          <span className="text-[#F28B0C]">bares</span> com{" "}
          <span className="text-[#F2A20C]">cardápio digital</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-[#BFAE99]"
        >
          Controle comandas, produtos e vendas de forma simples e rápida.
          Um sistema feito para não atrapalhar a correria do seu bar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4 justify-start"
        >
          <a
            href="#contato"
            className="bg-[#F2A20C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#F28B0C] transition w-full md:w-fit text-center"
          >
            Falar conosco
          </a>

          <a
            href="#bares"
            className="border border-[#F2BE5C] text-[#F28B0C] px-6 py-3 rounded-xl font-semibold hover:bg-[#F2BE5C]/20 transition w-full md:w-fit text-center"
          >
            Bares
          </a>
        </motion.div>
      </div>

      {/* IMAGEM */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex justify-center md:justify-end"
      >
        <Image
          src={homemImg}
          alt="Sistema de gestão para bares Simbora Beber"
          className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[520px] h-auto"
          priority
        />
      </motion.div>
    </section>
  );
}
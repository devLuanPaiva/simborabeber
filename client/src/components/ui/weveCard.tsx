"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WaveCard({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-[#FEF4E8]", className)}
    >
      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full bg-[#23222A]">
        <svg
          viewBox="0 0 1440 200"
          className="w-full h-[180px]"
          preserveAspectRatio="none"
        >
          <path
            d="
                M0,100
                C60,40 120,40 180,100
                C240,160 300,160 360,100
                C420,40 480,40 540,100
                C600,160 660,160 720,100
                C780,40 840,40 900,100
                C960,160 1020,160 1080,100
                C1140,40 1200,40 1260,100
                C1320,160 1380,160 1440,100
                L1440,0
                L0,0
                Z
            "
            className="fill-[#FEF4E8]"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" pt-28 p-6 text-white "
      >
        <h2 className="text-xl font-bold">Seu conteúdo aqui</h2>
        <p className="opacity-80">Descrição ou qualquer coisa</p>
      </motion.div>
    </div>
  );
}

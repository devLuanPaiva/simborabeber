"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { openWhatsApp } from "@/data/functions";
import Link from "next/link";

const links = [
  { name: "Como funciona", href: "#como-funciona" },
  { name: "Benefícios", href: "#beneficios" },
  { name: "Bares", href: "/bares" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Image
          src={"/logo-sem-fundo.png"}
          alt="Logo Simbora Beber"
          width={180}
          height={50}
          priority
        />

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#675f54] font-medium hover:text-[#F28B0C] transition"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={() => openWhatsApp()}
            className="bg-[#F2A20C] cursor-pointer text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#F28B0C] transition"
          >
            Falar conosco
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#F28B0C]"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-4 flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-lg"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[#BFAE99] font-medium hover:text-[#F28B0C] transition"
              >
                {link.name}
              </Link>
            ))}

            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="bg-[#F2A20C] text-white text-center px-5 py-3 rounded-xl font-semibold hover:bg-[#F28B0C] transition"
            >
              Falar conosco
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

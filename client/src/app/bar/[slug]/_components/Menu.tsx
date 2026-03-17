"use client";

import {
  IBar,
  IProduct,
  ProductCategory,
  ProductCategoryLabels,
} from "@/data/models";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/data/functions";
import { ProductImage } from "./ProductImage";

interface MenuProps {
  bar: IBar;
  products: IProduct[];
}

export default function Menu({ bar, products }: Readonly<MenuProps>) {
  const productsByCategory = useMemo(() => {
    const map: Record<string, IProduct[]> = {};

    products.forEach((product) => {
      if (!map[product.category]) {
        map[product.category] = [];
      }
      map[product.category].push(product);
    });

    return map;
  }, [products]);

  const categories = Object.keys(productsByCategory) as ProductCategory[];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-20">
      <header className="relative h-52 w-full bg-black">
        {bar.image && (
          <Image
            src={bar.image}
            alt={bar.name}
            fill
            className="object-cover opacity-70"
          />
        )}

        <div className="absolute bottom-4 left-6 text-white">
          <h1 className="text-3xl font-bold">{bar.name}</h1>
        </div>
      </header>

      <nav className="sticky top-0 z-50 bg-white border-b border-[#BFAE99]/30">
        <div className="flex overflow-x-auto gap-3 p-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollTo(cat)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-[#F2BE5C] text-white hover:bg-[#F28B0C] transition"
            >
              {ProductCategoryLabels[cat]}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-10">
        {categories.map((category) => (
          <section key={category} id={category}>
            <h2 className="text-2xl font-bold text-[#F28B0C] mb-4">
              {ProductCategoryLabels[category]}
            </h2>

            <div className="grid gap-4">
              {productsByCategory[category].map((product, index) => (
                <Link
                  key={product.id}
                  href={`/bar/${bar.slug}/produto/${product.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 border border-[#BFAE99]/20"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-zinc-100">
                      <ProductImage src={product.image} alt={product.name} />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-800">
                          {product.name}
                        </h3>

                        <p className="text-sm text-zinc-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <span className="font-bold text-[#F2A20C] mt-2">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

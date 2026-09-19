"use client";

import {
  IBar,
  IProduct,
  ProductCategory,
  ProductCategoryLabels,
} from "@/data/models";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/data/functions";
import { ProductImage } from "@/components/shared/ProductImage";
import { QuickAddButton } from "@/components/shared/QuickAddButton";
import { Badge } from "../ui/badge";
import { ChevronLeft, Plus, PackageOpen } from "lucide-react";

interface MenuProps {
  bar?: IBar;
  slug?: string;
  products: IProduct[];
  mode: "client" | "panel";
}

export default function Menu({
  bar,
  products,
  mode,
  slug,
}: Readonly<MenuProps>) {
  const isEmpty = products.length === 0;

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
  const contentMaxWidth = mode === "panel" ? "max-w-7xl" : "max-w-4xl";

  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>(categories[0]);

  useEffect(() => {
    if (!activeCategory || !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <div className="pb-20">
      {bar && mode === "client" && (
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
      )}

      {!isEmpty && (
        <nav className="sticky top-0 z-50 bg-white border-b border-[#BFAE99]/30 md:flex md:justify-center">
          <div className="flex overflow-x-auto gap-3 p-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  cat === activeCategory
                    ? "bg-[#F28B0C] text-white"
                    : "bg-[#F2BE5C] text-white hover:bg-[#F28B0C]"
                }`}
              >
                {ProductCategoryLabels[cat]}
              </button>
            ))}
          </div>
        </nav>
      )}

      {isEmpty && (
        <div className={`w-11/12 ${contentMaxWidth} mx-auto mt-16 flex flex-col items-center text-center space-y-4`}>
          <div className="bg-[#F2BE5C]/30 p-6 rounded-full">
            <PackageOpen size={40} className="text-[#F28B0C]" />
          </div>

          <h2 className="text-xl font-bold text-zinc-800">
            Nenhum produto cadastrado
          </h2>

          <p className="text-zinc-500 max-w-sm">
            {mode === "panel"
              ? "Comece adicionando produtos ao seu cardápio para gerenciar suas vendas."
              : "Aguarde até que o estabelecimento cadastre produtos."}
          </p>

          <div className="flex gap-3 mt-2">
            <Link
              href={mode === "panel" ? `/painel/bar/${slug}` : `/bares`}
              className="flex items-center gap-1 bg-white border border-[#BFAE99]/40 px-4 py-2 rounded-lg text-sm text-zinc-700 hover:bg-[#F2F2F2]"
            >
              <ChevronLeft size={16} />
              Voltar
            </Link>

            {mode === "panel" && (
              <Link
                href={`/painel/bar/${slug}/produtos/cadastrar`}
                className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Plus size={16} />
                Criar Produto
              </Link>
            )}
          </div>
        </div>
      )}

      {!isEmpty && activeCategory && (
        <div className={`w-11/12 ${contentMaxWidth} mx-auto mt-8`}>
          <section>
            <h2 className="text-2xl font-bold text-[#F28B0C] mb-4">
              {ProductCategoryLabels[activeCategory]}
            </h2>

            <div className="grid gap-4">
              {productsByCategory[activeCategory].map((product, index) => {
                const activeVariants = (product.variants ?? [])
                  .filter((v) => v.isActive)
                  .sort((a, b) => a.price - b.price);
                const displayPrice =
                  activeVariants.length > 0 ? Number(activeVariants[0].price) : Number(product.price ?? 0);

                return (
                  <Link
                    key={product.id}
                    href={
                      mode === "client"
                        ? `/bares/${bar?.slug}/produto/${product.id}`
                        : `/painel/bar/${slug}/produtos/editar/${product.id}`
                    }
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 border border-[#BFAE99]/20"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-zinc-100">
                        <ProductImage src={product.image} alt={product.name} />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-zinc-800">
                              {product.name}
                            </h3>
                            <p className="text-sm text-zinc-500 line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {mode === "panel" && (
                            <Badge
                              className={
                                product.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }
                            >
                              {product.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-[#F2A20C]">
                            {activeVariants.length > 0 && (
                              <span className="text-xs font-normal text-zinc-400">a partir de </span>
                            )}
                            {formatCurrency(Number(displayPrice))}
                          </span>

                          {mode === "client" && bar?.deliveryEnabled && (
                            <QuickAddButton product={product} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

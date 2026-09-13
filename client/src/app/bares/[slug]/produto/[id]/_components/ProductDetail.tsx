"use client";

import { IProduct, ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Beer, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/data/functions";
import { useCart } from "@/data/cart/CartContext";
import { appToast } from "@/utils/toast-ui";

interface ProductProps {
  product: IProduct;
  canOrder: boolean;
}

export function ProductDetail({ product, canOrder }: Readonly<ProductProps>) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      category: product.category,
      image: product.image,
    });
    appToast.success(`${product.name} adicionado ao carrinho`);
    setQuantity(1);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="relative h-96 w-full bg-zinc-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-[#F2BE5C]">
            <Beer size={60} className="text-white" />
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-105 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-t-3xl -mt-10 relative p-6 shadow-md"
      >
        <span className="inline-block text-sm font-medium text-white bg-[#F28B0C] px-3 py-1 rounded-full mb-3">
          {ProductCategoryLabels[product.category]}
        </span>

        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

        <p className="text-2xl font-bold text-[#F2A20C] mt-2">
          {formatCurrency(Number(product.price))}
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed">
          {product.description}
        </p>

        {canOrder && (
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-[#BFAE99]/40 rounded-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                aria-label="Diminuir quantidade"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                aria-label="Aumentar quantidade"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F2A20C] hover:bg-[#F28B0C] text-white font-semibold py-3 rounded-full transition"
            >
              <ShoppingCart size={18} />
              Adicionar ao carrinho
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

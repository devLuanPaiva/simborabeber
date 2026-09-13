"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/data/cart/CartContext";

export function CartButton({ slug }: Readonly<{ slug: string }>) {
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href={`/bares/${slug}/carrinho`}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#F2A20C] hover:bg-[#F28B0C] text-white font-semibold px-5 py-3 rounded-full shadow-lg transition"
    >
      <ShoppingCart size={20} />
      <span>{itemCount}</span>
    </Link>
  );
}

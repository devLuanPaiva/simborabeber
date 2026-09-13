"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/data/cart/CartContext";
import { formatCurrency } from "@/data/functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CartViewProps {
  slug: string;
  deliveryFee: number;
  minOrderValue: number;
}

export function CartView({ slug, deliveryFee, minOrderValue }: Readonly<CartViewProps>) {
  const router = useRouter();
  const { items, subtotal, setQuantity, setNotes, removeItem } = useCart();

  const missingForMinimum = Math.max(0, minOrderValue - subtotal);
  const canCheckout = items.length > 0 && missingForMinimum === 0;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-4">
        <div className="bg-[#F2BE5C]/30 p-6 rounded-full">
          <ShoppingBag size={40} className="text-[#F28B0C]" />
        </div>
        <h1 className="text-xl font-bold text-zinc-800">Seu carrinho está vazio</h1>
        <p className="text-zinc-500 max-w-sm">
          Volte ao cardápio e adicione produtos para montar seu pedido.
        </p>
        <Link
          href={`/bares/${slug}`}
          className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Voltar ao cardápio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-32">
      <header className="sticky top-0 z-10 bg-white border-b border-[#BFAE99]/30 flex items-center gap-3 p-4">
        <button onClick={() => router.back()} aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-zinc-800">Seu carrinho</h1>
      </header>

      <div className="w-11/12 max-w-2xl mx-auto mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-[#BFAE99]/20 p-4"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold text-zinc-800">{item.name}</h3>
                <span className="text-[#F2A20C] font-bold">{formatCurrency(item.price)}</span>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Remover ${item.name}`}
                className="text-zinc-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center border border-[#BFAE99]/40 rounded-full w-fit">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                aria-label={`Diminuir quantidade de ${item.name}`}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                aria-label={`Aumentar quantidade de ${item.name}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <Textarea
              placeholder="Alguma observação? Ex: sem cebola"
              defaultValue={item.notes ?? ""}
              onBlur={(e) => setNotes(item.productId, e.target.value)}
              className="text-sm"
            />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#BFAE99]/30 p-4 space-y-3">
        <div className="w-11/12 max-w-2xl mx-auto flex justify-between text-zinc-700">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="w-11/12 max-w-2xl mx-auto flex justify-between text-zinc-500 text-sm">
            <span>Taxa de entrega (estimada)</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        )}

        {missingForMinimum > 0 && (
          <p className="w-11/12 max-w-2xl mx-auto text-sm text-red-500">
            Faltam {formatCurrency(missingForMinimum)} para atingir o pedido mínimo de{" "}
            {formatCurrency(minOrderValue)}.
          </p>
        )}

        <div className="w-11/12 max-w-2xl mx-auto">
          <Button
            asChild={canCheckout}
            disabled={!canCheckout}
            className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white font-semibold py-6 rounded-full"
          >
            {canCheckout ? (
              <Link href={`/bares/${slug}/checkout`}>Ir para o checkout</Link>
            ) : (
              <span>Ir para o checkout</span>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

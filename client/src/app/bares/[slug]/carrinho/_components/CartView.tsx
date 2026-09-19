"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/data/cart/CartContext";
import { cartItemKey } from "@/data/cart/cartReducer";
import { formatCurrency } from "@/data/functions";
import { ICartItem, IProductAddon, ProductCategory } from "@/data/models";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface CartViewProps {
  slug: string;
  deliveryFee: number;
  minOrderValue: number;
  addonOptions: IProductAddon[];
}

function isPending(item: ICartItem): boolean {
  return !!item.sizeOptions?.length;
}

function canCombine(item: ICartItem): boolean {
  return item.category === ProductCategory.PIZZA && !isPending(item) && !item.extraProductId;
}

export function CartView({ slug, deliveryFee, minOrderValue, addonOptions }: Readonly<CartViewProps>) {
  const router = useRouter();
  const { items, subtotal, setQuantity, setNotes, removeItem, setVariant, setAddons, combineItems } = useCart();
  const [combineTarget, setCombineTarget] = useState<Record<string, string>>({});

  const hasPendingSize = items.some(isPending);
  const missingForMinimum = Math.max(0, minOrderValue - subtotal);
  const canCheckout = items.length > 0 && missingForMinimum === 0 && !hasPendingSize;

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
        {items.map((item) => {
          const key = cartItemKey(item);
          const pending = isPending(item);

          const combineOptions = canCombine(item)
            ? items.filter(
                (other) =>
                  cartItemKey(other) !== key &&
                  canCombine(other) &&
                  other.variantLabel === item.variantLabel &&
                  other.productId !== item.productId,
              )
            : [];

          const addonsForItem = addonOptions.filter(
            (addon) => !addon.category || addon.category === item.category,
          );
          const selectedAddonIds = item.addonIds ?? [];

          return (
            <div
              key={key}
              className="flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-[#BFAE99]/20 p-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-semibold text-zinc-800">{item.name}</h3>
                  <span className="text-[#F2A20C] font-bold">
                    {pending && <span className="text-xs font-normal text-zinc-400">a partir de </span>}
                    {formatCurrency(Number(item.price))}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(key)}
                  aria-label={`Remover ${item.name}`}
                  className="text-zinc-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {pending && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700">Escolha o tamanho</p>
                  <div className="flex flex-wrap gap-2">
                    {item.sizeOptions?.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setVariant(key, option)}
                        className="px-3 py-1.5 rounded-full text-sm font-semibold border border-[#F2A20C]/40 text-[#F28B0C] hover:bg-[#F2A20C] hover:text-white transition"
                      >
                        {option.label} · {formatCurrency(Number(option.price))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!pending && addonsForItem.length > 0 && (
                <div className="space-y-2 border-t border-[#BFAE99]/20 pt-3">
                  <p className="text-sm font-medium text-zinc-700">Adicionais</p>
                  <div className="space-y-2">
                    {addonsForItem.map((addon) => {
                      const checked = selectedAddonIds.includes(addon.id);

                      return (
                        <label
                          key={addon.id}
                          className="flex items-center justify-between gap-3 border border-[#BFAE99]/30 rounded-lg px-3 py-2 cursor-pointer"
                        >
                          <span className="flex items-center gap-2 text-sm text-zinc-700">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const nextAddons = checked
                                  ? (item.addonsSnapshot ?? []).filter((a) => a.id !== addon.id)
                                  : [
                                      ...(item.addonsSnapshot ?? []),
                                      { id: addon.id, name: addon.name, price: Number(addon.price) },
                                    ];
                                setAddons(key, nextAddons);
                              }}
                              className="accent-[#F2A20C]"
                            />
                            {addon.name}
                          </span>
                          <span className="text-sm font-semibold text-[#F2A20C]">
                            + {formatCurrency(Number(addon.price))}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center border border-[#BFAE99]/40 rounded-full w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(key, item.quantity - 1)}
                  className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                  aria-label={`Diminuir quantidade de ${item.name}`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(key, item.quantity + 1)}
                  className="p-2 text-zinc-600 hover:text-[#F28B0C]"
                  aria-label={`Aumentar quantidade de ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {combineOptions.length > 0 && (
                <div className="space-y-2 border-t border-[#BFAE99]/20 pt-3">
                  <p className="text-sm font-medium text-zinc-700">Combinar meio a meio com...</p>
                  <div className="flex gap-2">
                    <Select
                      value={combineTarget[key] ?? ""}
                      onValueChange={(val) => setCombineTarget((prev) => ({ ...prev, [key]: val }))}
                    >
                      <SelectTrigger className="flex-1 border border-[#BFAE99]/50 rounded-lg px-3 py-2 text-sm">
                        <SelectValue placeholder="Escolha outro sabor" />
                      </SelectTrigger>
                      <SelectContent>
                        {combineOptions.map((option) => (
                          <SelectItem key={cartItemKey(option)} value={cartItemKey(option)}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      disabled={!combineTarget[key]}
                      onClick={() => {
                        combineItems(key, combineTarget[key]);
                        setCombineTarget((prev) => ({ ...prev, [key]: "" }));
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#F2A20C] hover:bg-[#F28B0C] text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Combinar
                    </button>
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Alguma observação? Ex: sem cebola"
                defaultValue={item.notes ?? ""}
                onBlur={(e) => setNotes(key, e.target.value)}
                className="text-sm"
              />
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#BFAE99]/30 p-4 space-y-3">
        <div className="w-11/12 max-w-2xl mx-auto flex justify-between text-zinc-700">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(Number(subtotal))}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="w-11/12 max-w-2xl mx-auto flex justify-between text-zinc-500 text-sm">
            <span>Taxa de entrega (estimada)</span>
            <span>{formatCurrency(Number(deliveryFee))}</span>
          </div>
        )}

        {hasPendingSize && (
          <p className="w-11/12 max-w-2xl mx-auto text-sm text-red-500">
            Escolha o tamanho de todos os itens para continuar.
          </p>
        )}

        {missingForMinimum > 0 && (
          <p className="w-11/12 max-w-2xl mx-auto text-sm text-red-500">
            Faltam {formatCurrency(Number(missingForMinimum))} para atingir o pedido mínimo de{" "}
            {formatCurrency(Number(minOrderValue))}.
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

"use client";

import { IProduct, IProductAddon, ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Beer, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/data/functions";
import { useCart } from "@/data/cart/CartContext";
import { appToast } from "@/utils/toast-ui";

interface ProductProps {
  product: IProduct;
  canOrder: boolean;
  flavorOptions: IProduct[];
  addonOptions: IProductAddon[];
}

export function ProductDetail({ product, canOrder, flavorOptions, addonOptions }: Readonly<ProductProps>) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const sortedVariants = useMemo(
    () => [...(product.variants ?? [])].filter((v) => v.isActive).sort((a, b) => a.price - b.price),
    [product.variants],
  );
  const hasVariants = sortedVariants.length > 0;

  const [variantId, setVariantId] = useState<string | undefined>(sortedVariants[0]?.id);
  const selectedVariant = sortedVariants.find((v) => v.id === variantId);
  const canCombineFlavors = !!selectedVariant;

  const [extraProductId, setExtraProductId] = useState<string>("");
  useEffect(() => {
    if (!canCombineFlavors) setExtraProductId("");
  }, [canCombineFlavors]);

  const availableFlavors = useMemo(
    () =>
      flavorOptions.filter(
        (p) => p.id !== product.id && p.variants?.some((v) => v.isActive && v.label === selectedVariant?.label),
      ),
    [flavorOptions, product.id, selectedVariant?.label],
  );
  const extraProduct = availableFlavors.find((p) => p.id === extraProductId);

  const [addonIds, setAddonIds] = useState<string[]>([]);
  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  const selectedAddons = addonOptions.filter((a) => addonIds.includes(a.id));

  const unitPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price ?? 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const totalUnitPrice = unitPrice + addonsTotal;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: totalUnitPrice,
      quantity,
      category: product.category,
      image: product.image,
      ...(selectedVariant ? { variantId: selectedVariant.id, variantLabel: selectedVariant.label } : {}),
      ...(extraProduct ? { extraProductId: extraProduct.id, extraProductName: extraProduct.name } : {}),
      ...(selectedAddons.length
        ? {
            addonIds: selectedAddons.map((a) => a.id),
            addonsSnapshot: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: Number(a.price) })),
          }
        : {}),
    });
    appToast.success(`${product.name} adicionado ao carrinho`);
    setQuantity(1);
    setExtraProductId("");
    setAddonIds([]);
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
          {formatCurrency(totalUnitPrice)}
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed">
          {product.description}
        </p>

        {hasVariants && (
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold text-zinc-700">Tamanho</h2>
            <div className="flex flex-wrap gap-2">
              {sortedVariants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setVariantId(variant.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    variant.id === variantId
                      ? "bg-[#F2A20C] text-white border-[#F2A20C]"
                      : "bg-white text-zinc-700 border-[#BFAE99]/40"
                  }`}
                >
                  {variant.label} · {formatCurrency(Number(variant.price))}
                </button>
              ))}
            </div>
          </div>
        )}

        {canCombineFlavors && availableFlavors.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold text-zinc-700">Segundo sabor (opcional)</h2>
            <select
              value={extraProductId}
              onChange={(e) => setExtraProductId(e.target.value)}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
            >
              <option value="">Só {product.name}</option>
              {availableFlavors.map((flavor) => (
                <option key={flavor.id} value={flavor.id}>
                  {flavor.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-400">
              O preço é o do tamanho escolhido, independente do sabor.
            </p>
          </div>
        )}

        {hasVariants && addonOptions.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold text-zinc-700">Adicionais</h2>
            <div className="space-y-2">
              {addonOptions.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between gap-3 border border-[#BFAE99]/30 rounded-lg px-3 py-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={addonIds.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="accent-[#F2A20C]"
                    />
                    {addon.name}
                  </span>
                  <span className="text-sm font-semibold text-[#F2A20C]">
                    + {formatCurrency(Number(addon.price))}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

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

"use client";

import { Plus } from "lucide-react";
import { IProduct } from "@/data/models";
import { useCart } from "@/data/cart/CartContext";
import { appToast } from "@/utils/toast-ui";

interface QuickAddButtonProps {
  product: IProduct;
}

export function QuickAddButton({ product }: Readonly<QuickAddButtonProps>) {
  const { addItem } = useCart();

  const sortedVariants = [...(product.variants ?? [])]
    .filter((v) => v.isActive)
    .sort((a, b) => a.price - b.price);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (sortedVariants.length > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(sortedVariants[0].price),
        quantity: 1,
        category: product.category,
        image: product.image,
        sizeOptions: sortedVariants.map((v) => ({ id: v.id, label: v.label, price: Number(v.price) })),
      });
      appToast.success(`${product.name} adicionado - escolha o tamanho no carrinho`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price ?? 0),
      quantity: 1,
      category: product.category,
      image: product.image,
    });
    appToast.success(`${product.name} adicionado ao carrinho`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Adicionar ${product.name} ao carrinho`}
      className="shrink-0 bg-[#F2A20C] hover:bg-[#F28B0C] text-white p-2.5 rounded-full transition cursor-pointer"
    >
      <Plus size={18} />
    </button>
  );
}

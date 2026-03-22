"use client";

import { IProduct } from "@/data/models";
import { deleteProduct, toggleProductStatus } from "../actions";

interface ActionButtonsProps {
  product: IProduct;
  id: string;
  slug: string;
}
export function ActionButtons({
  product,
  id,
  slug,
}: Readonly<ActionButtonsProps>) {
  return (
    <div className="flex items-center flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={async () => toggleProductStatus(id, slug)}
        className={`flex-1 py-2.5 rounded-lg font-semibold cursor-pointer transition ${
          product.isActive
            ? "bg-zinc-200 text-zinc-700"
            : "bg-green-500 text-white"
        }`}
      >
        {product.isActive ? "Desativar" : "Ativar"}
      </button>

      <button
        type="button"
        onClick={async () => deleteProduct(id, slug)}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
      >
        Excluir
      </button>
    </div>
  );
}

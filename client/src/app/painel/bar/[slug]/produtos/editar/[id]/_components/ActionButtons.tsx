"use client";

import { IProduct } from "@/data/models";
import { deleteProduct, toggleProductStatus } from "../actions";
import { appToast } from "@/utils/toast-ui";

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
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await toggleProductStatus(id, slug);
            if (res?.success) {
              appToast.success(res.message || "Status atualizado");
            } else {
              appToast.error(res?.error || "Erro ao alterar status");
            }
          } catch (err: unknown) {
            console.error("Toggle status error:", err);
            appToast.error("Erro inesperado");
          }
        }}
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
        onClick={async () => {
          try {
            const res = await deleteProduct(id, slug);
            if (res?.success) {
              appToast.success(res.message || "Produto removido");
            } else {
              appToast.error(res?.error || "Erro ao remover produto");
            }
          } catch (err: unknown) {
            console.error("Delete product error:", err);
            appToast.error("Erro inesperado");
          }
        }}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
      >
        Excluir
      </button>
    </div>
  );
}

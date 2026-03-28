"use client";

import { useState } from "react";
import { addTabItem, addTabItems } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IProduct } from "@/data/models";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/data/functions";
import { ProductImage } from "@/components/shared/ProductImage";

interface AddProductsProps {
  products: IProduct[];
  slug: string;
  tabId: string;
}

export function AddProducts({
  products,
  slug,
  tabId,
}: Readonly<AddProductsProps>) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, number>>({});

  const filtered = products.filter((p: IProduct) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = (product: IProduct) => {
    setSelected((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleSubmit = async () => {
    const items = Object.entries(selected).map(([id, quantity]) => {
      const product = products.find((p: IProduct) => p.id === id);
      return {
        name: product?.name || "Produto Desconecido",
        price: product?.price || 0,
        quantity,
      };
    });

    const formData = new FormData();

    if (items.length === 1) {
      formData.append("name", items[0].name);
      formData.append("price", String(items[0].price));
      formData.append("quantity", String(items[0].quantity));
      try {
        const res = await addTabItem({ slug, tabId, formData });
        if (res?.success) {
          appToast.success(res.message || "Item adicionado com sucesso");
          setSelected({});
        } else {
          appToast.error(res?.error || "Erro ao adicionar item");
        }
      } catch (err) {
        console.error("Error adding tab item:", err);
        appToast.error("Erro inesperado");
      }
    } else {
      formData.append("items", JSON.stringify(items));
      try {
        const res = await addTabItems({ slug, tabId, formData });
        if (res?.success) {
          appToast.success(res.message || "Itens adicionados com sucesso");
          setSelected({});
        } else {
          appToast.error(res?.error || "Erro ao adicionar itens");
        }
      } catch (err) {
        console.error("Error adding tab items:", err);

        appToast.error("Erro inesperado");
      }
    }
  };

  return (
    <section className="bg-white p-4 rounded-xl border border-[#BFAE99]/20 space-y-3">
      <h3 className="font-bold text-zinc-800">Adicionar Produtos</h3>
      <input
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="space-y-2 max-h-[550px] overflow-y-auto divide-y-4 divide-slate-200">
        {filtered.map((product: IProduct) => (
          <div
            key={product.id}
            className="flex justify-between items-center py-2"
          >
            <div className="flex items-center gap-1.5">
              <div className="relative w-16 h-16 rounded overflow-hidden bg-zinc-100">
                <ProductImage src={product.image} alt={product.name} />
              </div>
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-zinc-500">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>{selected[product.id] || 0}</span>

              <button
                onClick={() => handleAdd(product)}
                className="p-2 bg-[#F2A20C] hover:bg-[#F28B0C] text-white rounded-md cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(selected).length > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] cursor-pointer text-white py-2 rounded-lg"
        >
          Adicionar itens
        </button>
      )}
    </section>
  );
}

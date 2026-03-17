"use client";

import { useState } from "react";
import { addTabItem, addTabItems } from "../actions";
import { IProduct } from "@/data/models";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/data/functions";

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

  const filtered = products
    .filter((p: IProduct) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 6);

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
      await addTabItem({ slug, tabId, formData });
    } else {
      formData.append("items", JSON.stringify(items));
      await addTabItems({ slug, tabId, formData });
    }

    setSelected({});
  };

  return (
    <section className="bg-white p-4 rounded-xl border border-[#BFAE99]/20 space-y-3">
      <input
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="space-y-2">
        {filtered.map((product: IProduct) => (
          <div key={product.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-zinc-500">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span>{selected[product.id] || 0}</span>

              <button
                onClick={() => handleAdd(product)}
                className="p-2 bg-[#F2A20C] text-white rounded-md"
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
          className="w-full bg-[#F28B0C] text-white py-2 rounded-lg"
        >
          Adicionar itens
        </button>
      )}
    </section>
  );
}

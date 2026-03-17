"use client";

import { ITabItem } from "@/data/models";
import { updateItemQuantity, deleteTabItem } from "../actions";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/data/functions";

interface TabItemsProps {
  items: ITabItem[];
  slug: string;
  tabId: string;
}

export function TabItems({ items, slug, tabId }: Readonly<TabItemsProps>) {
  return (
    <section className="space-y-2">
      {items.map((item: ITabItem) => (
        <div
          key={item.id}
          className="bg-white p-3 rounded-lg flex justify-between items-center border border-[#BFAE99]/20"
        >
          <div>
            <p className="font-semibold text-zinc-800">{item.name}</p>
            <p className="text-sm text-zinc-500">
              {formatCurrency(item.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateItemQuantity({
                  slug,
                  tabId,
                  itemId: item.id,
                  quantity: item.quantity - 1,
                })
              }
              className="p-2 bg-[#F2F2F2] rounded-md"
            >
              <Minus size={16} />
            </button>

            <span className="font-bold">{item.quantity}</span>

            <button
              onClick={() =>
                updateItemQuantity({
                  slug,
                  tabId,
                  itemId: item.id,
                  quantity: item.quantity + 1,
                })
              }
              className="p-2 bg-[#F2A20C] text-white rounded-md"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={() =>
                deleteTabItem({
                  slug,
                  tabId,
                  itemId: item.id,
                })
              }
              className="p-2 text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

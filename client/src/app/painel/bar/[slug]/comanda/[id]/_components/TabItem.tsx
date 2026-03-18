"use client";

import { ITabItem, TabStatus } from "@/data/models";
import { updateItemQuantity, deleteTabItem } from "../actions";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/data/functions";

interface TabItemsProps {
  items: ITabItem[];
  slug: string;
  tabId: string;
  tabStatus: TabStatus;
}

export function TabItems({
  items,
  slug,
  tabId,
  tabStatus,
}: Readonly<TabItemsProps>) {
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
              disabled={tabStatus !== TabStatus.OPEN}
              onClick={() =>
                updateItemQuantity({
                  slug,
                  tabId,
                  itemId: item.id,
                  quantity: item.quantity - 1,
                })
              }
              className={`p-2  bg-[#F2F2F2] rounded-md ${tabStatus === TabStatus.OPEN ? "hover:bg-[#E0E0E0] cursor-pointer" : "cursor-not-allowed"}`}
            >
              <Minus size={16} />
            </button>

            <span className="font-bold">{item.quantity}</span>

            <button
              disabled={tabStatus !== TabStatus.OPEN}
              onClick={() =>
                updateItemQuantity({
                  slug,
                  tabId,
                  itemId: item.id,
                  quantity: item.quantity + 1,
                })
              }
              className={`p-2 ${tabStatus === TabStatus.OPEN ? "bg-[#F2A20C] hover:bg-[#F28B0C] text-white cursor-pointer" : "bg-[#F2F2F2] text-zinc-400 cursor-not-allowed"}`}
            >
              <Plus size={16} />
            </button>

            <button
              disabled={tabStatus !== TabStatus.OPEN}
              onClick={() =>
                deleteTabItem({
                  slug,
                  tabId,
                  itemId: item.id,
                })
              }
              className={`p-2 ${tabStatus === TabStatus.OPEN ? "text-red-500 cursor-pointer" : "text-zinc-400 cursor-not-allowed"}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

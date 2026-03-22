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
  const isOpen = tabStatus === TabStatus.OPEN;

  return (
    <section className="space-y-3">
      <h3 className="font-bold text-zinc-800 text-lg">Itens da Comanda</h3>

      <div className="max-h-[550px] overflow-y-auto grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4">
        {items.map((item: ITabItem) => (
          <div
            key={item.id}
            className="bg-white border border-[#BFAE99]/30 rounded-md p-3 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-zinc-800 leading-tight text-sm md:text-base">
                  {item.name}
                </span>
                <span className=" text-[#BFAE99] font-medium text-xs md:text-sm">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <button
                disabled={!isOpen}
                onClick={() =>
                  deleteTabItem({
                    slug,
                    tabId,
                    itemId: item.id,
                  })
                }
                className={`p-2 rounded-lg transition ${
                  isOpen
                    ? "text-red-500 hover:bg-red-50 cursor-pointer"
                    : "text-zinc-300 cursor-not-allowed"
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row  items-center  sm:justify-between gap-2">
              <div className="flex items-center justify-between gap-2 bg-zinc-100 rounded-xl p-1 w-full sm:w-fit">
                <button
                  disabled={!isOpen}
                  onClick={() =>
                    updateItemQuantity({
                      slug,
                      tabId,
                      itemId: item.id,
                      quantity: item.quantity - 1,
                    })
                  }
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-lg
                    transition-all duration-200
                    ${
                      isOpen
                        ? "bg-white text-red-500 hover:bg-red-500 hover:text-white shadow-sm cursor-pointer"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    }
                  `}
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-[24px] text-center font-semibold text-sm text-zinc-800">
                  {item.quantity}
                </span>

                <button
                  disabled={!isOpen}
                  onClick={() =>
                    updateItemQuantity({
                      slug,
                      tabId,
                      itemId: item.id,
                      quantity: item.quantity + 1,
                    })
                  }
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-lg
                    transition-all duration-200 
                    ${
                      isOpen
                        ? "bg-white text-amber-500 hover:bg-amber-500 hover:text-white shadow-sm cursor-pointer"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    }
                  `}
                >
                  <Plus size={16} />
                </button>
              </div>

              <span className="text-sm font-semibold text-zinc-700">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

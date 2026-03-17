"use client";

import { closeTab } from "../actions";

interface CloseTabButtonProps {
  slug: string;
  tabId: string;
}

export function CloseTabButton({ slug, tabId }: Readonly<CloseTabButtonProps>) {
  return (
    <button
      onClick={() => closeTab({ slug, tabId })}
      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
    >
      Fechar Comanda
    </button>
  );
}


"use client"
import { closeTab } from "../actions";
import { appToast } from "@/utils/toast-ui";

interface CloseTabButtonProps {
  slug: string;
  tabId: string;
  itemsCount?: number;
}

export function CloseTabButton({ slug, tabId, itemsCount }: Readonly<CloseTabButtonProps>) {
  const handleClose = async () => {
    try {
      const res = await closeTab({ slug, tabId, itemsCount: itemsCount ?? 0 });
      if (res?.success) {
        appToast.success(res.message || "Comanda fechada com sucesso");
      } else {
        appToast.error(res?.error || "Erro ao fechar comanda");
      }
    } catch (err) {
      console.error("Error closing tab:", err);
      appToast.error("Erro inesperado");
    }
  };

  return (
    <button
      onClick={handleClose}
      className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white py-3 rounded-xl font-semibold"
    >
      Fechar Comanda
    </button>
  );
}

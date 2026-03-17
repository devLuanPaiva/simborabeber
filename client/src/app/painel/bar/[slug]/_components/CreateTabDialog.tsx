"use client";

import { createTab } from "../actions";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateTabDialog() {
  const { slug } = useParams();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-[#F2A20C] text-white hover:bg-[#F28B0C] transition-colors">
          Nova Comanda
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-[#BFAE99]/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Nova Comanda
          </DialogTitle>
        </DialogHeader>

        <form
          action={createTab.bind(null, slug as string)}
          className="space-y-5"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              Número da mesa
            </label>

            <input
              name="tableNumber"
              type="number"
              required
              placeholder="Ex: 5"
              className="w-full rounded-lg border border-[#BFAE99]/50 px-3 py-2 outline-none transition
              focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              Nome do cliente
            </label>

            <input
              name="customerName"
              type="text"
              placeholder="Ex: João"
              required
              className="w-full rounded-lg border border-[#BFAE99]/50 px-3 py-2 outline-none transition
              focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
            />
          </div>

          <DialogClose asChild>
            <Button
              type="submit"
              className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Criar Comanda
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { createProductAddon } from "../actions";
import { ProductCategoryLabels } from "@/data/models/IProduct";
import { appToast } from "@/utils/toast-ui";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type AddonFormProps = {
  slug: string;
};

export function AddonForm({ slug }: Readonly<AddonFormProps>) {
  const [category, setCategory] = useState<string>("");

  return (
    <form
      action={async (formData) => {
        try {
          const res = await createProductAddon(formData, slug);
          if (res?.success) {
            appToast.success(res.message || "Adicional criado com sucesso");
            setCategory("");
          } else {
            appToast.error(res?.error || "Erro ao criar adicional");
          }
        } catch (err) {
          console.error("Create product addon error:", err);
          appToast.error("Erro inesperado");
        }
      }}
      className="bg-white p-5 rounded-xl border border-[#BFAE99]/20 shadow-sm space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm text-zinc-600">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Borda Catupiry"
            className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="price" className="text-sm text-zinc-600">
            Preço <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="category" className="text-sm text-zinc-600">
          Categoria
        </Label>
        <p className="text-xs text-zinc-400">
          Deixe em branco para valer em qualquer categoria de produto
        </p>
        <div>
          <Select onValueChange={(val) => setCategory(val === "all" ? "" : val)} value={category || "all"}>
            <SelectTrigger className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {Object.entries(ProductCategoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input type="hidden" name="category" value={category} />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
      >
        Adicionar
      </button>
    </form>
  );
}

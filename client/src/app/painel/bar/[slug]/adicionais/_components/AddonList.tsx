"use client";

import { useState } from "react";
import { IProductAddon, ProductCategoryLabels } from "@/data/models";
import { formatCurrency } from "@/data/functions";
import { appToast } from "@/utils/toast-ui";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { PackageOpen } from "lucide-react";
import { deleteProductAddon, toggleProductAddonStatus, updateProductAddon } from "../actions";

type AddonListProps = {
  addons: IProductAddon[];
  slug: string;
};

export function AddonList({ addons, slug }: Readonly<AddonListProps>) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (addons.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-8 flex flex-col items-center text-center gap-3">
        <div className="bg-[#F2BE5C]/30 p-4 rounded-full">
          <PackageOpen size={28} className="text-[#F28B0C]" />
        </div>
        <p className="text-zinc-500 text-sm">Nenhum adicional cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {addons.map((addon) =>
        editingId === addon.id ? (
          <EditAddonRow
            key={addon.id}
            addon={addon}
            slug={slug}
            onDone={() => setEditingId(null)}
          />
        ) : (
          <AddonRow
            key={addon.id}
            addon={addon}
            slug={slug}
            onEdit={() => setEditingId(addon.id)}
          />
        ),
      )}
    </div>
  );
}

function AddonRow({
  addon,
  slug,
  onEdit,
}: Readonly<{ addon: IProductAddon; slug: string; onEdit: () => void }>) {
  return (
    <div className="bg-white rounded-xl border border-[#BFAE99]/20 shadow-sm p-4 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-zinc-800">{addon.name}</h3>
          <Badge className={addon.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
            {addon.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <p className="text-sm text-zinc-500">
          {addon.category ? ProductCategoryLabels[addon.category] : "Todas as categorias"}
        </p>
        <span className="font-bold text-[#F2A20C]">{formatCurrency(Number(addon.price))}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#BFAE99]/40 text-zinc-700 hover:bg-[#F2F2F2] cursor-pointer"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={async () => {
            const res = await toggleProductAddonStatus(addon.id, slug);
            if (res?.success) {
              appToast.success(res.message || "Status atualizado");
            } else {
              appToast.error(res?.error || "Erro ao alterar status");
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
            addon.isActive ? "bg-zinc-200 text-zinc-700" : "bg-green-500 text-white"
          }`}
        >
          {addon.isActive ? "Desativar" : "Ativar"}
        </button>

        <button
          type="button"
          onClick={async () => {
            const res = await deleteProductAddon(addon.id, slug);
            if (res?.success) {
              appToast.success(res.message || "Adicional removido");
            } else {
              appToast.error(res?.error || "Erro ao remover adicional");
            }
          }}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

function EditAddonRow({
  addon,
  slug,
  onDone,
}: Readonly<{ addon: IProductAddon; slug: string; onDone: () => void }>) {
  const [category, setCategory] = useState<string>(addon.category ?? "");

  return (
    <form
      action={async (formData) => {
        const res = await updateProductAddon(addon.id, slug, formData);
        if (res?.success) {
          appToast.success(res.message || "Adicional atualizado com sucesso");
          onDone();
        } else {
          appToast.error(res?.error || "Erro ao atualizar adicional");
        }
      }}
      className="bg-white rounded-xl border border-[#F2A20C]/40 shadow-sm p-4 space-y-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3">
        <Input name="name" defaultValue={addon.name} className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
        <Input name="price" type="number" step="0.01" defaultValue={addon.price} className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />

        <div>
          <Select onValueChange={(val) => setCategory(val === "all" ? "" : val)} value={category || "all"}>
            <SelectTrigger className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2">
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

      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2 rounded-lg font-semibold text-sm cursor-pointer">
          Salvar
        </button>
        <button type="button" onClick={onDone} className="flex-1 border border-[#BFAE99]/40 text-zinc-700 py-2 rounded-lg font-semibold text-sm cursor-pointer">
          Cancelar
        </button>
      </div>
    </form>
  );
}

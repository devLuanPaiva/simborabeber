"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { IProductVariant } from "@/data/models";
import { formatCurrency } from "@/data/functions";
import { appToast } from "@/utils/toast-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductVariant, deleteProductVariant, updateProductVariant } from "../actions";

type Props = {
  productId: string;
  slug: string;
  variants: IProductVariant[];
};

export function ProductVariantsManager({ productId, slug, variants }: Readonly<Props>) {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-5 shadow-sm space-y-4">
      <div>
        <h2 className="font-semibold text-zinc-800">Tamanhos/variações</h2>
        <p className="text-sm text-zinc-500">
          Configure tamanhos com preços diferentes, como pizzas (P, M, G, GG). Se não houver
          variações, o preço do produto acima é usado.
        </p>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-zinc-400">Nenhuma variação cadastrada.</p>
      )}

      <div className="space-y-2">
        {variants.map((variant) => (
          <VariantRow key={variant.id} variant={variant} productId={productId} slug={slug} />
        ))}
      </div>

      {showNewForm ? (
        <NewVariantForm
          productId={productId}
          slug={slug}
          onDone={() => setShowNewForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1 text-sm font-medium text-zinc-700 border border-[#BFAE99]/40 rounded-lg px-3 py-1.5 hover:bg-[#F2F2F2] cursor-pointer"
        >
          <Plus size={16} /> Adicionar tamanho
        </button>
      )}
    </div>
  );
}

function VariantRow({
  variant,
  productId,
  slug,
}: Readonly<{ variant: IProductVariant; productId: string; slug: string }>) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          const res = await updateProductVariant(variant.id, productId, slug, formData);
          if (res?.success) {
            appToast.success(res.message || "Variação atualizada com sucesso");
            setEditing(false);
          } else {
            appToast.error(res?.error || "Erro ao atualizar variação");
          }
        }}
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end border border-[#F2A20C]/40 rounded-lg p-3"
      >
        <div className="space-y-1">
          <Label className="text-xs text-zinc-500">Tamanho</Label>
          <Input name="label" defaultValue={variant.label} className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-zinc-500">Preço</Label>
          <Input name="price" type="number" step="0.01" required defaultValue={variant.price} className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-zinc-500">Número de fatias</Label>
          <Input name="numberOfSlices" type="number" min={1} required defaultValue={variant.numberOfSlices} className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2 rounded-lg font-semibold text-sm cursor-pointer">
            Salvar
          </button>
          <button type="button" onClick={() => setEditing(false)} className="flex-1 border border-[#BFAE99]/40 text-zinc-700 py-2 rounded-lg font-semibold text-sm cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-[#BFAE99]/20 rounded-lg p-3">
      <div>
        <span className="font-semibold text-zinc-800">{variant.label}</span>
        <span className="text-sm text-zinc-500 ml-2">{formatCurrency(Number(variant.price))}</span>
        <span className="text-xs text-zinc-400 ml-2">{variant.numberOfSlices} fatias</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#BFAE99]/40 text-zinc-700 hover:bg-[#F2F2F2] cursor-pointer"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={async () => {
            const res = await deleteProductVariant(variant.id, productId, slug);
            if (res?.success) {
              appToast.success(res.message || "Variação removida");
            } else {
              appToast.error(res?.error || "Erro ao remover variação");
            }
          }}
          aria-label={`Remover tamanho ${variant.label}`}
          className="p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function NewVariantForm({
  productId,
  slug,
  onDone,
}: Readonly<{ productId: string; slug: string; onDone: () => void }>) {
  return (
    <form
      action={async (formData) => {
        const res = await createProductVariant(productId, slug, formData);
        if (res?.success) {
          appToast.success(res.message || "Variação criada com sucesso");
          onDone();
        } else {
          appToast.error(res?.error || "Erro ao criar variação");
        }
      }}
      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end border border-[#BFAE99]/40 rounded-lg p-3"
    >
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500">Tamanho</Label>
        <Input name="label" placeholder="G" required className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500">Preço</Label>
        <Input name="price" type="number" step="0.01" placeholder="45.90" required className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500">Número de fatias</Label>
        <Input name="numberOfSlices" type="number" min={1} placeholder="8" required className="border border-[#BFAE99]/50 rounded-lg px-3 py-2" />
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

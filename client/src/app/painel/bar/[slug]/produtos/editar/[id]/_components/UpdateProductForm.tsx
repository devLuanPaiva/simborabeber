"use client";

import { appToast } from "@/utils/toast-ui";
import { updateProduct } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ProductCategory,
  ProductCategoryLabels,
  IProduct,
} from "@/data/models";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Props = {
  product: IProduct;
  id: string;
  slug: string;
};

export function UpdateProductForm({ product, id, slug }: Readonly<Props>) {
  return (
    <form
      id="update-product-form"
      action={async (formData: FormData) => {
        try {
          const res = await updateProduct(id, slug, formData);
          if (res?.success) {
            appToast.success(res.message || "Produto atualizado com sucesso");
          } else {
            appToast.error(res?.error || "Erro ao atualizar produto");
          }
        } catch (err) {
          console.error("Update product error:", err);
          appToast.error("Erro inesperado");
        }
      }}
      className="bg-white rounded-xl border border-[#BFAE99]/20 p-5 shadow-sm space-y-4"
    >
      <div className="space-y-1">
        <Label className="text-sm text-zinc-600">Nome</Label>
        <Input
          name="name"
          defaultValue={product.name}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm text-zinc-600">Preço</Label>
        <Input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category" className="text-sm text-zinc-600">
          Categoria <span className="text-red-500">*</span>
        </Label>
        <div>
          <Select onValueChange={(val) => setCategory(val)} value={category}>
            <SelectTrigger className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>

            <SelectContent>
              {Object.entries(ProductCategoryLabels).map(([value, Label]) => (
                <SelectItem key={value} value={value}>
                  {Label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input type="hidden" name="category" value={category} required />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-sm text-zinc-600">Descrição</Label>
        <Textarea
          name="description"
          defaultValue={product.description}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm text-zinc-600">Imagem (URL)</Label>
        <Input
          name="image"
          defaultValue={product.image}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
        />
      </div>

      <Input type="hidden" name="_method" value="patch" />
    </form>
  );
}

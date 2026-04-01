"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { createProduct, uploadImage } from "../actions";
import { ProductCategoryLabels } from "@/data/models/IProduct";
import { appToast } from "@/utils/toast-ui";
import { FileUpload } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type ProductRegistrationFormProps = {
  slug: string;
};

export function ProductRegistrationForm({
  slug,
}: Readonly<ProductRegistrationFormProps>) {
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  async function handleUpload(file: File) {
    try {
      setLoadingUpload(true);
      const response = await uploadImage(file, productName);
      if (response.success) {
        setImageUrl(response.url);
      } else {
        appToast.error(response.error || "Erro ao fazer upload da imagem");
      }
    } finally {
      setLoadingUpload(false);
    }
  }

  const handleImageModeChange = (mode: "upload" | "url") => {
    setImageMode(mode);
    setImageUrl("");
  };

  return (
    <form
      action={async (formData) => {
        try {
          const res = await createProduct(formData, slug);
          if (res?.success) {
            appToast.success(res.message || "Produto criado com sucesso");
            setImageUrl("");
            setImageMode("upload");
          } else {
            appToast.error(res?.error || "Erro ao criar produto");
          }
        } catch (err) {
          console.error("Create product error:", err);
          appToast.error("Erro inesperado");
        }
      }}
      className="bg-white p-5 rounded-xl border border-[#BFAE99]/20 shadow-sm space-y-5"
    >
      <div className="space-y-1">
        <Label htmlFor="productName" className="text-sm text-zinc-600">
          Nome <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productName"
          name="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      </div>

      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm text-zinc-600">
          Descrição <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageInput" className="text-sm text-zinc-600">
          Imagem <span className="text-red-500">*</span>
        </Label>
        {!productName.trim() && (
          <p className="text-sm text-red-500">
            Digite o nome do produto para habilitar as opções de imagem
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!productName.trim()}
            onClick={() => handleImageModeChange("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              imageMode === "upload"
                ? "bg-[#F2A20C] text-white"
                : "bg-white text-zinc-600"
            }`}
          >
            <Upload size={16} /> Upload
          </button>

          <button
            type="button"
            disabled={!productName.trim()}
            onClick={() => handleImageModeChange("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              imageMode === "url"
                ? "bg-[#F2A20C] text-white"
                : "bg-white text-zinc-600"
            }`}
          >
            <LinkIcon size={16} /> URL
          </button>
        </div>
      </div>

      {imageMode === "upload" && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 items-start">
          <div className="space-y-2">
            <div
              className={
                productName.trim() ? "" : "opacity-50 pointer-events-none"
              }
            >
              <FileUpload
                onChange={(files) => {
                  const file = files?.[0];
                  if (file && productName.trim()) handleUpload(file);
                }}
              />
            </div>

            {loadingUpload && (
              <p className="text-sm text-zinc-500">Enviando imagem...</p>
            )}
          </div>

          <div className="w-full h-[180px] rounded-lg overflow-hidden border border-[#BFAE99]/20 bg-zinc-50 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-zinc-400 px-3 text-center">
                Pré-visualização da imagem
              </span>
            )}
          </div>
        </div>
      )}

      {imageMode === "url" && (
        <Input
          id="imageInput"
          type="text"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={!productName.trim()}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      )}

      {imageMode === "url" && imageUrl && (
        <div className="w-32 h-32 rounded-lg overflow-hidden border border-[#BFAE99]/20">
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Input type="hidden" name="imageUrl" value={imageUrl} />

      <button
        type="submit"
        className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
      >
        Criar Produto
      </button>
    </form>
  );
}

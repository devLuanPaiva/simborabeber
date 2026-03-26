"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { createProduct, uploadImage } from "../actions";
import { ProductCategoryLabels } from "@/data/models/IProduct";

type ProductRegistrationFormProps = {
  slug: string;
};

export function ProductRegistrationForm({
  slug,
}: Readonly<ProductRegistrationFormProps>) {
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  async function handleUpload(file: File) {
    try {
      setLoadingUpload(true);
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoadingUpload(false);
    }
  }

  return (
    <form
      action={async (formData) => {
        await createProduct(formData, slug);
      }}
      className="bg-white p-5 rounded-xl border border-[#BFAE99]/20 shadow-sm space-y-5"
    >
      <div className="space-y-1">
        <label htmlFor="productName" className="text-sm text-zinc-600">
          Nome
        </label>
        <input
          id="productName"
          name="productName"
          required
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1">
          <label htmlFor="price" className="text-sm text-zinc-600">
            Preço
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="category" className="text-sm text-zinc-600">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {Object.entries(ProductCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm text-zinc-600">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imageInput" className="text-sm text-zinc-600">
          Imagem
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setImageMode("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer ${
              imageMode === "upload"
                ? "bg-[#F2A20C] text-white"
                : "bg-white text-zinc-600"
            }`}
          >
            <Upload size={16} /> Upload
          </button>

          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer ${
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
        <div className="space-y-2">
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            className="w-full text-sm"
          />

          {loadingUpload && (
            <p className="text-sm text-zinc-500">Enviando imagem...</p>
          )}
        </div>
      )}

      {imageMode === "url" && (
        <input
          id="imageInput"
          type="text"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
        />
      )}

      {imageUrl && (
        <div className="w-32 h-32 rounded-lg overflow-hidden border border-[#BFAE99]/20">
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <input type="hidden" name="imageUrl" value={imageUrl} />

      <button
        type="submit"
        className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
      >
        Criar Produto
      </button>
    </form>
  );
}

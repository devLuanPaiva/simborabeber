"use client";

import { useState } from "react";
import { registerBar, uploadImage } from "./actions";
import { Upload, Link as LinkIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { appToast } from "@/utils/toast-ui";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function BarRegisterPage() {
  const [name, setName] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  async function handleUpload(file: File) {
    try {
      setLoadingUpload(true);
      const response = await uploadImage(file, name);
      if (response.success) {
        setImageUrl(response.url);
      } else {
        appToast.error(response.error || "Erro ao fazer upload da imagem");
      }
    } finally {
      setLoadingUpload(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F2F2F2] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-[#BFAE99]/20 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Cadastrar Bar</h1>
          <p className="text-sm text-zinc-500">
            Crie seu bar e comece a gerenciar seu cardápio
          </p>
        </div>

        <form
          action={async (formData) => {
            await registerBar(formData);
          }}
          className="space-y-5"
        >
          <div className="space-y-1">
            <Label className="text-sm text-zinc-600">
              Nome do bar <span className="text-red-500">*</span>
            </Label>
            <Input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bar do João"
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-zinc-600">
              Endereço <span className="text-red-500">*</span>
            </Label>
            <Input
              name="address"
              required
              placeholder="Rua, número, bairro..."
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-600">
              Imagem do bar <span className="text-red-500">*</span>
            </Label>
            {!name.trim() && (
              <p className="text-sm text-red-500">
                Digite o nome do bar para habilitar as opções de imagem
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${
                  imageMode === "upload"
                    ? "bg-[#F2A20C] text-white"
                    : "bg-white text-zinc-600"
                }`}
              >
                <Upload size={16} />
                Upload
              </button>

              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${
                  imageMode === "url"
                    ? "bg-[#F2A20C] text-white"
                    : "bg-white text-zinc-600"
                }`}
              >
                <LinkIcon size={16} />
                URL
              </button>
            </div>
          </div>

          {imageMode === "upload" && (
            <div className="grid grid-cols-1  gap-4 items-start">
              <div className="space-y-2">
                <div
                  className={
                    name.trim() ? "" : "opacity-50 pointer-events-none"
                  }
                >
                  <FileUpload
                    onChange={(files) => {
                      const file = files?.[0];
                      if (file && name.trim()) handleUpload(file);
                    }}
                  />
                </div>

                {!name.trim() && (
                  <p className="text-xs text-zinc-400">
                    Informe o nome do bar para enviar a imagem
                  </p>
                )}

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
            <div className="space-y-3">
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={!name.trim()}
                className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 outline-none focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 disabled:opacity-50"
              />

              {imageUrl && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-[#BFAE99]/20">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          <input type="hidden" name="imageUrl" value={imageUrl} />

          <button
            type="submit"
            className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
          >
            Criar Bar
          </button>
        </form>
      </div>
    </main>
  );
}

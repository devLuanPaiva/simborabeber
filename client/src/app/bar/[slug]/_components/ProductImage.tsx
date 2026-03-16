"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
}

export function ProductImage({ src, alt }: Readonly<ProductImageProps>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-xs gap-1">
        <ImageOff size={32} />
        <span className="text-center">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#F28B0C]" size={18} />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}

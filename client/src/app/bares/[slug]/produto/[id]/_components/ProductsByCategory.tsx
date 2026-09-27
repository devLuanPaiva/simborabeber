
import { IProduct, ProductCategory, ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import Link from "next/link";
import { Beer } from "lucide-react";
import { formatCurrency } from "@/data/functions";
import { ApiResponse } from "@/data/types";

interface ProductsByCategoryProps {
  slug: string;
  category: ProductCategory;
}

export async function ProductsByCategory({ slug, category }: Readonly<ProductsByCategoryProps>) {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(
    `${base_url}/product/by-bar?slug=${slug}&category=${category}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 60,
      },
    }
  );

  const data: ApiResponse<IProduct[]> = await response.json();

  const products = data.results


  return (
    <section className="max-w-3xl mx-auto  px-6 space-y-4">

      <h2 className="text-xl font-bold text-[#F28B0C]">
        Mais {ProductCategoryLabels[category]}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

        {products.map((product) => {
          const activeVariants = (product.variants ?? [])
            .filter((v) => v.isActive)
            .sort((a, b) => a.price - b.price);
          const displayPrice = activeVariants.length > 0 ? Number(activeVariants[0].price) : Number(product.price ?? 0);

          return (
          <Link
            key={product.id}
            href={`/bares/${slug}/produto/${product.id}`}
            className="min-w-[180px] max-w-[180px] bg-white rounded-xl shadow-sm border border-[#BFAE99]/20 hover:shadow-md transition"
          >
            <div className="relative h-44 w-full bg-gray-100 rounded-t-xl overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Beer className="text-[#F28B0C]" />
                </div>
              )}
            </div>

            <div className="p-3 space-y-1">

              <h3 className="text-sm font-semibold line-clamp-2">
                {product.name}
              </h3>

              <p className="text-[#F2A20C] font-bold text-sm">
               {activeVariants.length > 0 && (
                 <span className="text-xs font-normal text-zinc-400">a partir de </span>
               )}
               {formatCurrency(Number(displayPrice))}
              </p>

            </div>
          </Link>
          );
        })}

      </div>
    </section>
  );
}

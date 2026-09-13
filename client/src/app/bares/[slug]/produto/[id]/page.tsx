import { ProductDetail } from "./_components/ProductDetail";
import { notFound } from "next/navigation";
import { ProductsByCategory } from "./_components/ProductsByCategory";
import { ProductsByCategoryLoading } from "./_components/ProductsByCategoryLoading";
import { Suspense } from "react";
import { getBarBySlug, getProductById } from "@/actions";

export default async function ProductPage(
  props: Readonly<{ params: Promise<{ slug: string; id: string }> }>,
) {
  const { slug, id } = await props.params;

  const [product, bar] = await Promise.all([getProductById(id), getBarBySlug(slug)]);

  if (!product?.isActive) {
    return notFound();
  }

  return (
    <main className=" min-h-screen pb-24">
      <ProductDetail product={product} canOrder={!!bar?.deliveryEnabled} />
      <Suspense fallback={<ProductsByCategoryLoading />}>
        <ProductsByCategory slug={slug} category={product.category} />
      </Suspense>
    </main>
  );
}

import { ProductDetail } from "./_components/ProductDetail";
import { notFound } from "next/navigation";
import { ProductsByCategory } from "./_components/ProductsByCategory";
import { ProductsByCategoryLoading } from "./_components/ProductsByCategoryLoading";
import { Suspense } from "react";
import { getBarBySlug, getProductAddonsByBarSlug, getProductById, getProductsByBarSlug } from "@/actions";

export default async function ProductPage(
  props: Readonly<{ params: Promise<{ slug: string; id: string }> }>,
) {
  const { slug, id } = await props.params;

  const [product, bar] = await Promise.all([getProductById(id), getBarBySlug(slug)]);

  if (!product?.isActive) {
    return notFound();
  }

  const hasVariants = !!product.variants?.length;

  const [siblingProducts, addons] = await Promise.all([
    hasVariants ? getProductsByBarSlug(slug) : Promise.resolve([]),
    hasVariants ? getProductAddonsByBarSlug(slug) : Promise.resolve([]),
  ]);

  const flavorOptions = siblingProducts.filter(
    (p) => p.id !== product.id && p.category === product.category && p.variants?.length,
  );
  const addonOptions = addons.filter((a) => a.isActive && (!a.category || a.category === product.category));

  return (
    <main className=" min-h-screen pb-24">
      <ProductDetail
        product={product}
        canOrder={!!bar?.deliveryEnabled}
        flavorOptions={flavorOptions}
        addonOptions={addonOptions}
      />
      <Suspense fallback={<ProductsByCategoryLoading />}>
        <ProductsByCategory slug={slug} category={product.category} />
      </Suspense>
    </main>
  );
}

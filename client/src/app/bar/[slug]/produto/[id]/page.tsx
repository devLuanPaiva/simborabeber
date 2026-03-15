import { IProduct } from "@/data/models";
import ProductDetail from "./_components/ProductDetail";
import { notFound } from "next/navigation";
import { ProductsByCategory } from "./_components/ProductsByCategory";
import { ApiResponse } from "@/data/types";
import { ProductsByCategoryLoading } from "./_components/ProductsByCategoryLoading";
import { Suspense } from "react";

export default async function ProductPage(
    props: Readonly<{ params: Promise<{ slug: string; id: string }> }>
) {
    const { slug, id } = await props.params;

    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${base_url}/product/${id}`, {
        cache: "force-cache",
        next: {
            revalidate: 60,
        }
    });

    const data: ApiResponse<IProduct> = await response.json();

    const product = data.results;

    if (!product || !product.isActive) {
        return notFound();
    }

    return (
        <main className=" min-h-screen pb-24">
            <ProductDetail product={product} />
            <Suspense fallback={<ProductsByCategoryLoading />}>
                <ProductsByCategory slug={slug} category={product.category} />
            </Suspense>
        </main>
    );
}
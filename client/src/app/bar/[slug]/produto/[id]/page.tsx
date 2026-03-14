import { ApiResponse, IProduct } from "@/data/models";
import ProductDetail from "./_components/ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductPage(
    props: Readonly<{ params: Promise<{ id: string }> }>
) {
    const { id } = await props.params;

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
        <main className="bg-[#F2F2F2] min-h-screen">
            <ProductDetail product={product} />
        </main>
    );
}
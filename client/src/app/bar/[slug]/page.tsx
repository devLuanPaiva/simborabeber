import { ApiResponse, IBar, IProduct } from "@/data/models";
import Menu from "./_components/Menu";

export default async function BarPage(
    props: Readonly<{ params: Promise<{ slug: string }> }>
) {
    const { slug } = await props.params;

    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    const response_bar = await fetch(`${base_url}/bar/${slug}`, {
        cache: "force-cache",
        next: {
            revalidate: 60,
        }
    });

    const data_bar: ApiResponse<IBar> = await response_bar.json();

    const bar = data_bar.results

    const response_products = await fetch(`${base_url}/product/by-bar/${slug}`, {
        cache: "force-cache",
        next: {
            revalidate: 3600,
        }
    });

    const data_products: ApiResponse<IProduct[]> = await response_products.json();

    const products = data_products.results;

    return (
        <main className="bg-[#F2F2F2] min-h-screen">
            <Menu bar={bar} products={products} />
        </main>
    );
}
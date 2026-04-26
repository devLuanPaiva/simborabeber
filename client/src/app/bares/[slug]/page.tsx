import Menu from "@/components/shared/Menu";
import { IBar } from "@/data/models";
import { getBarBySlug, getProductsByBarSlug } from "@/actions";

export default async function BarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  const bar = await getBarBySlug(slug);
  const products = await getProductsByBarSlug(slug);

  return (
    <main className="min-h-screen">
      <Menu bar={bar as IBar} products={products} mode="client" />
    </main>
  );
}

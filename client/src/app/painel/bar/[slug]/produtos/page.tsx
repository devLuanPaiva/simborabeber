import Menu from "@/components/shared/Menu";
import { Header } from "@/components/layout/Header";
import { getProductsByBarSlug } from "@/actions";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await getProductsByBarSlug(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

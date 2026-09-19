import Menu from "@/components/shared/Menu";
import { Header } from "@/components/layout/Header";
import { BackLink } from "@/components/shared/BackLink";
import { getProductsByBarSlug } from "@/actions";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await getProductsByBarSlug(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

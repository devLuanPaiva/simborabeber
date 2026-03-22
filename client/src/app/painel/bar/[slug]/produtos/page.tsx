import Menu from "@/components/bars/Menu";
import { Header } from "@/components/layout/Header";
import { panelBarProductsActions } from "./actions";
import { BackLink } from "@/components/shared/BackLink";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await panelBarProductsActions(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />

      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

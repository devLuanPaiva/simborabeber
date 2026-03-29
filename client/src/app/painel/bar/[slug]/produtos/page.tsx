import Menu from "@/components/shared/Menu";
import { Header } from "@/components/layout/Header";
import { panelBarProductsActions } from "./actions";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await panelBarProductsActions(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

import Menu from "@/components/shared/Menu";
import { BarActions } from "./actions";
import { IBar } from "@/data/models";

export default async function BarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  const { bar, products } = await BarActions(slug);

  return (
    <main className="min-h-screen">
      <Menu bar={bar as IBar} products={products} mode="client" />
    </main>
  );
}

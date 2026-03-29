import Menu from "@/components/shared/Menu";
import { BarActions } from "./actions";

export default async function BarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  const { bar, products } = await BarActions(slug);

  return (
    <main className="min-h-screen">
      <Menu bar={bar} products={products} mode="client" />
    </main>
  );
}

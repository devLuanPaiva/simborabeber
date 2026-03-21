import Menu from "@/components/bars/Menu";
import { Header } from "@/components/layout/Header";
import { panelBarProductsActions } from "./actions";
import { ChevronLeft, Link } from "lucide-react";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await panelBarProductsActions(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />
      <div className="mx-auto w-11/12 max-w-7xl flex justify-start py-6">
        <Link
          href={`/painel/bar/${slug}/`}
          className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white cursor-pointer px-3 py-1 rounded-md text-sm font-medium"
        >
          <ChevronLeft /> Voltar
        </Link>
      </div>
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

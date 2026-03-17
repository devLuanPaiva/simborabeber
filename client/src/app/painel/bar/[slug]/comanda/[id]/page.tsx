import { Header } from "@/components/layout/Header";
import { AddProducts } from "./_components/AddProducts";
import { CloseTabButton } from "./_components/CloseTabButton";
import { TabItems } from "./_components/TabItem";
import { panelTabActions } from "./actions";
import { formatCurrency } from "@/data/functions";

export default async function PanelTabPage(
  props: Readonly<{ params: Promise<{ slug: string; id: string }> }>,
) {
  const { slug, id } = await props.params;

  const { products, tab, tab_items } = await panelTabActions(slug, id);

  const total = tab_items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <main className=" bg-[#F2F2F2] min-h-screen">
      <Header slug_bar={slug} />
      <div className="mx-auto w-11/12 max-w-7xl space-y-6 py-8">
        <section className="bg-white rounded-xl p-4 shadow-sm border border-[#BFAE99]/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-zinc-500">Mesa</p>
              <p className="text-lg font-bold text-zinc-800">
                {tab.tableNumber ?? "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-xl font-bold text-[#F28B0C]">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </section>
        <CloseTabButton slug={slug} tabId={id} />
        <TabItems slug={slug} tabId={id} items={tab_items} />
        <AddProducts slug={slug} tabId={id} products={products} />
      </div>
    </main>
  );
}

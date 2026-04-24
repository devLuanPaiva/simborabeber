import { Header } from "@/components/layout/Header";
import { AddProducts } from "./_components/AddProducts";
import { CloseTabButton } from "./_components/CloseTabButton";
import { TabItems } from "./_components/TabItem";
import { panelTabActions } from "./actions";
import { formatCurrency, formatDate } from "@/data/functions";
import { TabStatus } from "@/data/models";
import { BackLink } from "@/components/shared/BackLink";

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
      <BackLink
        slug={`painel/bar/${slug}/comandas`}
        label="Voltar para Comandas"
      />
      <div className="mx-auto w-11/12 max-w-7xl space-y-6 pb-8">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#BFAE99]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  tab.status === TabStatus.OPEN
                    ? "bg-green-100 text-green-700"
                    : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {tab.status === TabStatus.OPEN ? "Aberta" : "Fechada"}
              </span>
            </div>

            <div className="text-right">
              <p className="text-xs text-zinc-500">Total</p>
              <p className="text-2xl font-bold text-[#F28B0C]">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-zinc-500">Mesa</p>
              <p className="font-bold text-zinc-800 text-lg">
                {tab.tableNumber ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Cliente</p>
              <p className="font-semibold text-zinc-800">
                {tab.customerName ?? "Não informado"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#F2F2F2] rounded-lg p-3">
              <p className="text-xs text-zinc-500">Aberta por</p>
              <p className="font-semibold text-zinc-800">
                {tab.waiterOpen?.name ?? "—"}
              </p>
            </div>

            <div className="bg-[#F2F2F2] rounded-lg p-3">
              <p className="text-xs text-zinc-500">Fechada por</p>
              <p className="font-semibold text-zinc-800">
                {tab.waiterClosed?.name ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex justify-between text-xs text-zinc-500">
            <span>Abertura: {formatDate(tab.createdAt)}</span>

            {tab.closedAt && (
              <span className="text-right">
                Fechamento: {formatDate(tab.closedAt)}
              </span>
            )}
          </div>
        </section>
        {tab.status === TabStatus.OPEN && (
          <CloseTabButton slug={slug} tabId={id} itemsCount={tab_items.length} />
        )}
        <TabItems
          slug={slug}
          tabId={id}
          items={tab_items}
          tabStatus={tab.status}
        />
        {tab.status === TabStatus.OPEN && (
          <AddProducts slug={slug} tabId={id} products={products} />
        )}
      </div>
    </main>
  );
}

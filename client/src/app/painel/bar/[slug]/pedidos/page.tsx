import { Header } from "@/components/layout/Header";
import { BackLink } from "@/components/shared/BackLink";
import { getOrdersByBarSlug } from "./actions";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { PedidosBoard } from "./_components/PedidosBoard";

export default async function PedidosPanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  const [orders, accessToken] = await Promise.all([
    getOrdersByBarSlug(slug),
    getAccessToken(),
  ]);

  return (
    <main className="min-h-screen">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <div className="w-11/12 mx-auto pb-8 max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6">Pedidos</h1>
        <PedidosBoard slug={slug} initialOrders={orders} accessToken={accessToken} />
      </div>
    </main>
  );
}

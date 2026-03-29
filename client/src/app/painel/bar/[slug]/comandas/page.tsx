import { Suspense } from "react";
import { TabsList } from "./_components/TabsList";
import { Header } from "@/components/layout/Header";
import { CreateTabDialog } from "./_components/CreateTabDialog";
import { TabsListLoading } from "./_components/TabsListLoading";
import { BackLink } from "@/components/shared/BackLink";

export default async function TabsPanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  return (
    <main className="min-h-screen">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <div className="w-11/12 mx-auto pb-8 max-w-7xl">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Comandas</h1>

          <CreateTabDialog />
        </div>
        <Suspense fallback={<TabsListLoading />}>
          <TabsList slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}

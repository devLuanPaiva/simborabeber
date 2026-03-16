import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { TabsList } from "./_components/TabsList";
import { CreateTabDialog } from "./_components/CreateTabDialog";
import { TabsListLoading } from "./_components/TabsListLoading";

export default async function PanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />

      <div className="w-11/12 mx-auto py-8 max-w-7xl">
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

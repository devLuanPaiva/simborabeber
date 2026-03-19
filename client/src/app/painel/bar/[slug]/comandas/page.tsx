import { Suspense } from "react";
import { TabsList } from "./_components/TabsList";
import { Header } from "@/components/layout/Header";
import { CreateTabDialog } from "./_components/CreateTabDialog";
import { TabsListLoading } from "./_components/TabsListLoading";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function TabsPanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  return (
    <main className="min-h-screen">
      <Header slug_bar={slug} />
      <div className="mx-auto w-11/12 max-w-7xl flex justify-start py-6">
        <Link
          href={`/painel/bar/${slug}/`}
          className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white cursor-pointer px-3 py-1 rounded-md text-sm font-medium"
        >
          <ChevronLeft /> Voltar
        </Link>
      </div>
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

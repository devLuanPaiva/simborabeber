import { Header } from "@/components/layout/Header";
import { TabCard } from "./_components/TabCard";
import { Button } from "@/components/ui/button";
import { PanelBarActions } from "./actions";

export default async function PanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  const tabs = await PanelBarActions(slug);

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />

      <div className="w-11/12 mx-auto py-8 max-w-7xl">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Comandas</h1>

          <Button className="px-4 py-2 bg-[#F28B0C] text-white hover:bg-[#F2BE5C] rounded-md text-sm md:text-base font-medium transition">
            Nova Comanda
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tabs.map((tab) => (
            <TabCard key={tab.id} tab={tab} slug={slug} />
          ))}
        </div>
      </div>
    </main>
  );
}

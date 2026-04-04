import { ChevronLeft, PackageOpen} from "lucide-react";
import { tabsPanelBarActions } from "../actions";
import { TabCard } from "./TabCard";
import Link from "next/link";
import { CreateTabDialog } from "./CreateTabDialog";

export async function TabsList({ slug }: Readonly<{ slug: string }>) {
  const tabs = await tabsPanelBarActions(slug);

  const isEmpty = tabs.length === 0;
  return (
    <div className="flex flex-col items-center">
      {!isEmpty && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tabs.map((tab) => (
            <TabCard key={tab.id} tab={tab} slug={slug} />
          ))}
        </section>
      )}

      {isEmpty && (
        <div className="w-11/12 max-w-4xl mx-auto mt-16 flex flex-col items-center text-center space-y-4">
          <div className="bg-[#F2BE5C]/30 p-6 rounded-full">
            <PackageOpen size={40} className="text-[#F28B0C]" />
          </div>

          <h2 className="text-xl font-bold text-zinc-800">
            Nenhuma comanda encontrada
          </h2>

          <p className="text-zinc-500 max-w-sm">
            Comece adicionando suas comandas para gerenciar suas vendas.

          </p>

          <div className="flex gap-3 mt-2">
            <Link
              href={`/painel/bar/${slug}`}
              className="flex items-center gap-1 bg-white border border-[#BFAE99]/40 px-4 py-2 rounded-lg text-sm text-zinc-700 hover:bg-[#F2F2F2]"
            >
              <ChevronLeft size={16} />
              Voltar
            </Link>

            <CreateTabDialog />

          </div>
        </div>
      )}
    </div>
  );
}

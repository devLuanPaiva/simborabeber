import { Beer } from "lucide-react";
import { getBares } from "./actions";
import { BarsList } from "./_components/BaresList";

export default async function BaresPage() {
  const bars = await getBares();

  return (
    <main className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#F28B0C] flex items-center gap-2">
            <Beer className="text-[#F2A20C]" />
            Bares disponíveis
          </h1>

          <p className="text-zinc-600 mt-2">
            Escolha um bar para acessar o cardápio
          </p>
        </header>
        <BarsList bars={bars} />

        {bars.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Nenhum bar ativo encontrado
          </div>
        )}
      </div>
    </main>
  );
}
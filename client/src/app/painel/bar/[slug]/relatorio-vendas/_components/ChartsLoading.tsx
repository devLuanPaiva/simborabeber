import { Loader2 } from "lucide-react";

export function ChartsLoading() {
  return (
    <div className="bg-white border border-[#BFAE99]/20 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center h-75">

      <Loader2
        className="animate-spin text-[#F28B0C]"
        size={40}
      />

      <p className="text-sm text-zinc-500 mt-3">
        Carregando dados da semana...
      </p>

    </div>
  );
}
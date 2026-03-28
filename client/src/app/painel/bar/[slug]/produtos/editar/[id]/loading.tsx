import { Header } from "@/components/layout/Header";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F2F2F2] animate-pulse">
      <Header slug_bar="..." />

      <div className="mx-auto w-11/12 max-w-7xl flex justify-start py-6">
        <div className="h-8 w-48 bg-[#F2A20C]/40 rounded-md" />
      </div>

      <div className="w-11/12 mx-auto py-8 max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 shadow-sm flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-zinc-200" />

          <div className="space-y-2 w-full">
            <div className="h-5 w-40 bg-zinc-200 rounded" />
            <div className="h-4 w-24 bg-[#F28B0C]/40 rounded" />
            <div className="h-3 w-32 bg-zinc-200 rounded" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-5 shadow-sm space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i + 1} className="space-y-2">
              <div className="h-4 w-24 bg-zinc-200 rounded" />
              <div className="h-10 w-full bg-zinc-200 rounded-lg" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="h-11 w-full bg-[#F2A20C]/40 rounded-lg" />
          <div className="h-11 w-full bg-zinc-300 rounded-lg" />
          <div className="h-11 w-full bg-red-300 rounded-lg" />
        </div>
      </div>
    </main>
  );
}

import { Header } from "@/components/layout/Header";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F2F2F2] animate-pulse">
      <Header slug_bar="..." />

      <div className="sticky top-0 z-50 bg-white border-b border-[#BFAE99]/30">
        <div className="flex gap-3 p-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i + 1}
              className="h-8 w-24 rounded-full bg-[#F2BE5C]/40"
            />
          ))}
        </div>
      </div>

      <div className="mx-auto w-11/12 max-w-4xl flex justify-between py-6">
        <div className="h-8 w-28 bg-[#F2BE5C]/40 rounded-md" />
        <div className="h-8 w-28 bg-green-600/40 rounded-md" />
      </div>
      <div className="w-11/12 max-w-4xl mx-auto mt-8 space-y-10">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex + 1} className="space-y-4">
            <div className="h-6 w-40 bg-[#F28B0C]/40 rounded" />

            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i + 1}
                  className="flex gap-4 bg-white rounded-xl p-3 border border-[#BFAE99]/20"
                >
                  <div className="w-24 h-24 bg-zinc-200 rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-zinc-200 rounded" />
                    <div className="h-4 w-full bg-zinc-200 rounded" />
                    <div className="h-4 w-2/3 bg-zinc-200 rounded" />

                    <div className="h-5 w-24 bg-[#F2A20C]/40 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

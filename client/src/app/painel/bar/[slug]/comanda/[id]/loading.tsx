export default function Loading() {
  return (
    <main className="animate-pulse bg-[#F2F2F2] min-h-screen">
      <div className="mx-auto w-11/12 max-w-7xl py-8 space-y-6">
        <div className="h-12 bg-white rounded-xl" />

        <div className="flex justify-start">
          <div className="h-8 w-40 bg-[#F2A20C] opacity-60 rounded-md" />
        </div>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#BFAE99]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 bg-zinc-200 rounded-full" />

            <div className="text-right">
              <div className="h-3 w-16 bg-zinc-200 rounded-md mb-2" />
              <div className="h-8 w-32 bg-zinc-200 rounded-md" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="h-3 w-20 bg-zinc-100 rounded mb-2" />
              <div className="h-5 w-36 bg-zinc-200 rounded" />
            </div>

            <div>
              <div className="h-3 w-20 bg-zinc-100 rounded mb-2" />
              <div className="h-5 w-48 bg-zinc-200 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#F2F2F2] rounded-lg p-3">
              <div className="h-3 w-24 bg-zinc-200 rounded mb-2" />
              <div className="h-4 w-32 bg-zinc-200 rounded" />
            </div>

            <div className="bg-[#F2F2F2] rounded-lg p-3">
              <div className="h-3 w-24 bg-zinc-200 rounded mb-2" />
              <div className="h-4 w-32 bg-zinc-200 rounded" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-zinc-500">
            <div className="h-3 w-40 bg-zinc-100 rounded" />
            <div className="h-3 w-40 bg-zinc-100 rounded" />
          </div>
        </section>

        <div className="h-12 bg-red-400 rounded-xl w-full" />

        <section className="space-y-3">
          <div className="h-6 w-48 bg-zinc-200 rounded" />

          <div className="max-h-[550px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i + 1}
                className="bg-white border border-[#BFAE99]/30 rounded-md p-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2 w-3/4">
                    <div className="h-4 w-36 bg-zinc-200 rounded" />
                    <div className="h-3 w-24 bg-zinc-100 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-zinc-200 rounded" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-zinc-100 rounded-xl p-1 w-fit">
                    <div className="h-8 w-8 bg-white rounded" />
                    <div className="h-4 w-6 bg-zinc-200 rounded" />
                    <div className="h-4 w-6 bg-zinc-200 rounded" />
                  </div>

                  <div className="h-4 w-16 bg-zinc-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 rounded-xl border border-[#BFAE99]/20 space-y-3">
          <div className="h-5 w-40 bg-zinc-200 rounded" />
          <div className="h-10 w-full bg-zinc-100 rounded-md" />

          <div className="space-y-2 max-h-[250px] overflow-y-auto divide-y-4 divide-slate-200">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i + 1}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center gap-1.5">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-zinc-100" />
                  <div className="w-36">
                    <div className="h-4 w-36 bg-zinc-200 rounded mb-1" />
                    <div className="h-3 w-20 bg-zinc-100 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-zinc-200 rounded text-center" />
                  <div className="p-2 bg-[#F2A20C] opacity-60 rounded-md h-8 w-8" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-10 bg-[#F2A20C] opacity-60 rounded-lg w-full" />
        </section>
      </div>
    </main>
  );
}

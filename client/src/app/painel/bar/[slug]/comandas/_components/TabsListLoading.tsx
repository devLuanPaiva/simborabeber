export function TabsListLoading() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i + 1}
          className="bg-white rounded-xl border border-[#BFAE99]/20 shadow-sm p-4 animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-16 bg-zinc-200 rounded-full"></div>
            <div className="h-4 w-20 bg-zinc-200 rounded"></div>
          </div>

          <div className="h-4 w-24 bg-zinc-200 rounded mb-2"></div>

          <div className="h-5 w-32 bg-zinc-200 rounded"></div>

          <div className="mt-3 h-5 w-20 bg-zinc-200 rounded"></div>
        </div>
      ))}
    </section>
  );
}

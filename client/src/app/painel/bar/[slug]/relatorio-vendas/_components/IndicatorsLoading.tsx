export function IndicatorsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i + 1}
          className="bg-white border border-[#BFAE99]/20 rounded-xl p-4 shadow-sm animate-pulse"
        >
          <div className="w-8 h-8 bg-[#F2BE5C]/40 rounded-lg mb-3" />

          <div className="h-3 w-24 bg-zinc-200 rounded mb-2" />

          <div className="h-6 w-20 bg-zinc-300 rounded" />
        </div>
      ))}
    </div>
  );
}

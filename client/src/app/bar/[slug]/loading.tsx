export default function Loading() {
  return (
    <main className="bg-[#F2F2F2] min-h-screen animate-pulse">

      <div className="h-52 bg-gray-300"></div>

      <div className="flex gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i + 1} className="h-8 w-24 bg-gray-300 rounded-full"></div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i + 1}
            className="flex gap-4 bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-300 rounded"></div>

            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}

      </div>

    </main>
  );
}
export default function Loading() {
  return (
    <main className="p-4 space-y-4 animate-pulse">
      <div className="h-20 bg-white rounded-xl"></div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i + 1} className="h-16 bg-white rounded-lg"></div>
      ))}

      <div className="h-40 bg-white rounded-xl"></div>

      <div className="h-12 bg-white rounded-xl"></div>
    </main>
  );
}

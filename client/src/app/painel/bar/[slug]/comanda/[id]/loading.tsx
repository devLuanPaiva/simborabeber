export default function Loading() {
  return (
    <main className=" animate-pulse">
      <div className="mx-auto w-11/12 max-w-7xl py-8 space-y-6">
        <div className="h-20 bg-white rounded-xl"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i + 1} className="h-16 bg-white rounded-lg"></div>
        ))}
        <div className="h-40 bg-white rounded-xl"></div>
        <div className="h-12 bg-white rounded-xl"></div>
      </div>
    </main>
  );
}

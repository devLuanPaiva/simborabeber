export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F2F2F2] p-8">
            <div className="max-w-6xl mx-auto">

                <div className="h-8 w-56 bg-zinc-200 rounded mb-10 animate-pulse"></div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i + 1}
                            className="rounded-2xl bg-white shadow-sm overflow-hidden border border-[#BFAE99]/30"
                        >
                            <div className="h-40 bg-zinc-200 animate-pulse"></div>

                            <div className="p-4">
                                <div className="h-5 w-3/4 bg-zinc-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
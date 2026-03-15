export function ProductsByCategoryLoading() {
    return (
        <section className="max-w-3xl mx-auto  px-6 space-y-4 animate-pulse">

            <div className="h-6 w-40 bg-gray-300 rounded"></div>

            <div className="flex gap-4 overflow-hidden">

                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i +1}
                        className="min-w-[180px] max-w-[180px] bg-white rounded-xl border border-[#BFAE99]/20"
                    >
                        <div className="h-32 bg-gray-300 rounded-t-xl"></div>

                        <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
}
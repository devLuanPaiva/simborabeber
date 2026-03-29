export default function Loading() {
    return (
        <main className="bg-[#F2F2F2] min-h-screen animate-pulse">

            <div className="h-72 bg-gray-300"></div>

            <div className="max-w-3xl mx-auto p-6 space-y-4">

                <div className="h-6 w-24 bg-gray-300 rounded"></div>

                <div className="h-8 w-64 bg-gray-300 rounded"></div>

                <div className="h-6 w-32 bg-gray-300 rounded"></div>

                <div className="space-y-2 pt-4">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>

            </div>

        </main>
    );
}
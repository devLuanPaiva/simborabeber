import { Header } from "@/components/layout/Header"
import { ITab } from "@/data/models"
import { ApiResponse } from "@/data/types"
import { serverFetch } from "@/lib/api/serverFetch"
import { TabCard } from "./_components/TabCard"


export default async function PanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>
) {

  const { slug } = await props.params

  const response_tabs = await serverFetch(`/tab/by-bar/${slug}`, {
    cache: "no-cache",
  })

  const data_tabs: ApiResponse<ITab[]> = await response_tabs.json()

  const tabs = data_tabs.results ?? []

  return (
    <main className="min-h-screen">

      <Header slug_bar={slug} />

      <div className="p-6">

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-bold text-zinc-800">
            Comandas
          </h1>

          <span className="text-sm text-zinc-500">
            {tabs.length} comandas
          </span>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {tabs.map((tab) => (
            <TabCard
              key={tab.id}
              tab={tab}
              slug={slug}
            />
          ))}

        </div>

      </div>

    </main>
  )
}
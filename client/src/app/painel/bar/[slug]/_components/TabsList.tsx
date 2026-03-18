import { PanelBarActions } from "../actions";
import { TabCard } from "./TabCard";

export async function TabsList({ slug }: Readonly<{ slug: string }>) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula um atraso de 1 segundo
  const tabs = await PanelBarActions(slug);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tabs.map((tab) => (
        <TabCard key={tab.id} tab={tab} slug={slug} />
      ))}
    </section>
  );
}

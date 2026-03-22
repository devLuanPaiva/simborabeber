import { tabsPanelBarActions } from "../actions";
import { TabCard } from "./TabCard";

export async function TabsList({ slug }: Readonly<{ slug: string }>) {
  const tabs = await tabsPanelBarActions(slug);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tabs.map((tab) => (
        <TabCard key={tab.id} tab={tab} slug={slug} />
      ))}
    </section>
  );
}

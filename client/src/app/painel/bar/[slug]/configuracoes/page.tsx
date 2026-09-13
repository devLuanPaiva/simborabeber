import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BackLink } from "@/components/shared/BackLink";
import { getBarBySlug } from "@/actions";
import { DeliverySettingsForm } from "./_components/DeliverySettingsForm";

export default async function DeliverySettingsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  if (!bar) {
    return notFound();
  }

  return (
    <main className="min-h-screen">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <div className="w-11/12 mx-auto pb-8 max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6">Configurações</h1>
        <DeliverySettingsForm bar={bar} slug={slug} />
      </div>
    </main>
  );
}

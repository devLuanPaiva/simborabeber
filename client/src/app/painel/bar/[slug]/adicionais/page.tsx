import { Header } from "@/components/layout/Header";
import { BackLink } from "@/components/shared/BackLink";
import { getProductAddonsByBarSlug } from "@/actions";
import { AddonForm } from "./_components/AddonForm";
import { AddonList } from "./_components/AddonList";

export default async function PanelBarAddonsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const addons = await getProductAddonsByBarSlug(slug);

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}/produtos`} label="Voltar para produtos" />

      <div className="w-11/12 mx-auto pb-10 max-w-7xl">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Adicionais</h1>
            <p className="text-zinc-500 text-sm">
              Itens extras que o cliente pode escolher em um produto, como bordas de pizza
            </p>
          </div>

          <AddonForm slug={slug} />
          <AddonList addons={addons} slug={slug} />
        </div>
      </div>
    </main>
  );
}

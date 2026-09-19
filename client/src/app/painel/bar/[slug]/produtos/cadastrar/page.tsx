import { Header } from "@/components/layout/Header";
import { ProductRegistrationForm } from "./_components/ProductRegistrationForm";
import { BackLink } from "@/components/shared/BackLink";

export default async function ProductRegistrationPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />
      <BackLink
        slug={`painel/bar/${slug}/produtos`}
        label="Voltar para produtos"
      />

      <div className="w-11/12 mx-auto py-8 max-w-7xl">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Novo Produto</h1>
            <p className="text-zinc-500 text-sm">
              Cadastre um novo item no cardápio
            </p>
          </div>

          <ProductRegistrationForm slug={slug} />
        </div>
      </div>
    </main>
  );
}

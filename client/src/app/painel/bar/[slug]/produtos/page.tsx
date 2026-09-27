import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import Menu from "@/components/shared/Menu";
import { Header } from "@/components/layout/Header";
import { BackLink } from "@/components/shared/BackLink";
import { getProductsByBarSlug } from "@/actions";

export default async function PanelBarProductsPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const products = await getProductsByBarSlug(slug);

  return (
    <main className="min-h-screen ">
      <Header slug_bar={slug} />
      <BackLink
        slug={`painel/bar/${slug}`}
        label="Voltar"
        actions={
          <>
            <Link
              href={`/painel/bar/${slug}/adicionais`}
              className="flex items-center gap-1 bg-[#F2BE5C]/20 border border-[#F2A20C] text-[#F28B0C] hover:bg-[#F2BE5C]/40 px-3 py-1 rounded-md text-sm font-medium transition"
            >
              <Tag size={16} />
              Adicionais
            </Link>

            <Link
              href={`/painel/bar/${slug}/produtos/cadastrar`}
              className="flex items-center gap-1 bg-[#F28B0C] hover:bg-[#F2A20C] text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              <Plus size={16} />
              Cadastrar Produto
            </Link>
          </>
        }
      />
      <Menu products={products} mode="panel" slug={slug} />
    </main>
  );
}

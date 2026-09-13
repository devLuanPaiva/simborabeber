import { Header } from "@/components/layout/Header";
import { ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import { formatCurrency } from "@/data/functions";
import { BackLink } from "@/components/shared/BackLink";
import { ActionButtons } from "./_components/ActionButtons";
import { UpdateProductForm } from "./_components/UpdateProductForm";
import { ProductVariantsManager } from "./_components/ProductVariantsManager";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/actions";

export default async function PanelBarProductPage(
  props: Readonly<{ params: Promise<{ slug: string; id: string }> }>,
) {
  const { slug, id } = await props.params;

  const product = await getProductById(id);

  if (!product) return <div>Produto não encontrado</div>;

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />
      <BackLink
        slug={`painel/bar/${slug}/produtos`}
        label="Voltar para Produtos"
      />
      <div className="w-11/12 mx-auto pb-8 max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F2BE5C]/30">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="font-semibold text-zinc-800">{product.name}</p>
              <p className="text-sm text-[#F28B0C] font-bold">
                {formatCurrency(Number(product.price))}
              </p>
              <p className="text-xs text-zinc-500">
                {ProductCategoryLabels[product.category]}
              </p>
            </div>
          </div>
          <Badge
            className={
              product.isActive
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }
          >
            {product.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <UpdateProductForm product={product} id={id} slug={slug} />

        <ProductVariantsManager productId={id} slug={slug} variants={product.variants ?? []} />

        <div className="flex flex-col gap-3 pt-2">
          <button
            form="update-product-form"
            type="submit"
            className="flex-1 bg-[#F2A20C] hover:bg-[#F28B0C] cursor-pointer text-white py-2.5 rounded-lg font-semibold transition"
          >
            Salvar alterações
          </button>

          <ActionButtons product={product} id={id} slug={slug} />
        </div>
      </div>
    </main>
  );
}

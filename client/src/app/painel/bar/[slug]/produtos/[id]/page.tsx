import { Header } from "@/components/layout/Header";
import {
  panelBarProductActions,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "./actions";
import { ProductCategory, ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import { formatCurrency } from "@/data/functions";

export default async function PanelBarProductPage(
  props: Readonly<{ params: Promise<{ slug: string; id: string }> }>,
) {
  const { slug, id } = await props.params;

  const product = await panelBarProductActions(id);

  if (!product) return <div>Produto não encontrado</div>;

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />

      <div className="w-11/12 mx-auto py-8 max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 shadow-sm flex items-center gap-4">
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
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-zinc-500">
              {ProductCategoryLabels[product.category]}
            </p>
          </div>
        </div>

        <form
          id="update-product-form"
          action={updateProduct.bind(null, id)}
          className="bg-white rounded-xl border border-[#BFAE99]/20 p-5 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Nome</label>
            <input
              name="name"
              defaultValue={product.name}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Preço</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Categoria</label>
            <select
              name="category"
              defaultValue={product.category}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
            >
              {Object.values(ProductCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {ProductCategoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Descrição</label>
            <textarea
              name="description"
              defaultValue={product.description}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Imagem (URL)</label>
            <input
              name="image"
              defaultValue={product.image}
              className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 focus:border-[#F2A20C] focus:ring-2 focus:ring-[#F2BE5C]/40 outline-none"
            />
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            form="update-product-form"
            type="submit"
            className="flex-1 bg-[#F2A20C] hover:bg-[#F28B0C] cursor-pointer text-white py-2.5 rounded-lg font-semibold transition"
          >
            Salvar alterações
          </button>

          <form action={toggleProductActive.bind(null, id, product.isActive)}>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-lg font-semibold cursor-pointer transition ${
                product.isActive
                  ? "bg-zinc-200 text-zinc-700"
                  : "bg-green-500 text-white"
              }`}
            >
              {product.isActive ? "Desativar" : "Ativar"}
            </button>
          </form>

          <form action={deleteProduct.bind(null, id)}>
            <button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
            >
              Excluir
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

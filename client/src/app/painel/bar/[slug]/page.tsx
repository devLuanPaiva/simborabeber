import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { ClipboardList, Beer, Users, BarChart, Bike, Settings } from "lucide-react";
import { getBarBySlug } from "@/actions";

export default async function PanelBarPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  const modules = [
    {
      title: "Comandas",
      description: "Gerencie pedidos e mesas",
      icon: ClipboardList,
      href: `/painel/bar/${slug}/comandas`,
      visible: bar?.comandasEnabled ?? true,
    },
    {
      title: "Produtos",
      description: "Cardápio e itens do bar",
      icon: Beer,
      href: `/painel/bar/${slug}/produtos`,
      visible: true,
    },
    {
      title: "Pedidos",
      description: "Fila de pedidos de delivery e retirada",
      icon: Bike,
      href: `/painel/bar/${slug}/pedidos`,
      visible: !!bar?.deliveryEnabled,
    },
    {
      title: "Relatórios",
      description: "Visualize dados e métricas",
      icon: BarChart,
      href: `/painel/bar/${slug}/relatorio-vendas`,
      visible: true,
    },
    {
      title: "Usuários",
      description: "Gerencie usuários e permissões",
      icon: Users,
      href: `/painel/usuarios`,
      visible: true,
    },
    {
      title: "Configurações",
      description: "Comandas, delivery, taxas e horários",
      icon: Settings,
      href: `/painel/bar/${slug}/configuracoes`,
      visible: true,
    },
  ].filter((module) => module.visible);

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Header slug_bar={slug} />

      <div className="w-11/12 mx-auto py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-800">Painel do Bar</h1>
          <p className="text-zinc-500">Acesse os módulos do sistema</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link key={module.title} href={module.href} className="group">
                <div
                  className="
                  bg-white rounded-2xl p-6 h-full
                  border border-[#BFAE99]/20
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  cursor-pointer
                  hover:-translate-y-1
                "
                >
                  <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-[#F2BE5C]/30 text-[#F28B0C] group-hover:bg-[#F2A20C] group-hover:text-white transition">
                    <Icon size={24} />
                  </div>

                  <h2 className="text-lg font-semibold text-zinc-800 group-hover:text-[#F28B0C] transition">
                    {module.title}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-1">
                    {module.description}
                  </p>

                  <div className="mt-4 text-sm font-medium text-[#F2A20C] group-hover:text-[#F28B0C]">
                    Acessar →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

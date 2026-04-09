import { Header } from "@/components/layout/Header";
import { Suspense } from "react";
import { IndicatorsLoading } from "./_components/IndicatorsLoading";
import { Indicators } from "./_components/Indicators";
import { BackLink } from "@/components/shared/BackLink";

export default async function SalesReportPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  return (
    <main className="min-h-screen">
      <Header slug_bar={slug} />
      <BackLink slug={`painel/bar/${slug}`} label="Voltar" />
      <div className="mx-auto w-11/12 max-w-7xl pt-6  pb-10">
        <Suspense fallback={<IndicatorsLoading />}>
          <Indicators />
        </Suspense>
      </div>
    </main>
  );
}

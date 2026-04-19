import { Header } from "@/components/layout/Header";
import { Suspense } from "react";
import { IndicatorsLoading } from "./_components/IndicatorsLoading";
import { Indicators } from "./_components/Indicators";
import { BackLink } from "@/components/shared/BackLink";
import { WeeklySalesComparation } from "./_components/WeeklySalesComparation";
import { ChartsLoading } from "./_components/ChartsLoading";
import { MonthlyWeeklySalesComparation } from "./_components/MonthlyWeeklySalesComparation";
import { LastMonthsComparation } from "./_components/LastMonthsComparation";
import { CategoriesComparation } from "./_components/CategoriesComparation";

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

      <section className="mx-auto w-11/12 max-w-7xl grid md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2">
          <Suspense fallback={<ChartsLoading />}>
            <LastMonthsComparation />
          </Suspense>
        </div>
        <Suspense fallback={<ChartsLoading />}>
          <CategoriesComparation />
        </Suspense>
      </section>
      <section className="mx-auto w-11/12 max-w-7xl grid md:grid-cols-2 gap-6 mb-10">
        <Suspense fallback={<ChartsLoading />}>
          <WeeklySalesComparation />
        </Suspense>
        <Suspense fallback={<ChartsLoading />}>
          <MonthlyWeeklySalesComparation />
        </Suspense>
      </section>
    </main>
  );
}

import { notFound } from "next/navigation";
import { getBarBySlug } from "@/actions";
import { CheckoutForm } from "./_components/CheckoutForm";

export default async function CheckoutPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  if (!bar?.deliveryEnabled) {
    return notFound();
  }

  return (
    <CheckoutForm
      slug={slug}
      deliveryFee={Number(bar.deliveryFee)}
      minOrderValue={Number(bar.minOrderValue)}
    />
  );
}

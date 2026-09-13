import { notFound } from "next/navigation";
import { getBarBySlug } from "@/actions";
import { CartView } from "./_components/CartView";

export default async function CartPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  if (!bar?.deliveryEnabled) {
    return notFound();
  }

  return (
    <CartView
      slug={slug}
      deliveryFee={Number(bar.deliveryFee)}
      minOrderValue={Number(bar.minOrderValue)}
    />
  );
}

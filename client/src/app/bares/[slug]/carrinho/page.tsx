import { notFound } from "next/navigation";
import { getBarBySlug, getProductAddonsByBarSlug } from "@/actions";
import { CartView } from "./_components/CartView";

export default async function CartPage(
  props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  if (!bar?.deliveryEnabled) {
    return notFound();
  }

  const addons = await getProductAddonsByBarSlug(slug);
  const addonOptions = addons.filter((addon) => addon.isActive);

  return (
    <CartView
      slug={slug}
      deliveryFee={Number(bar.deliveryFee)}
      minOrderValue={Number(bar.minOrderValue)}
      addonOptions={addonOptions}
    />
  );
}

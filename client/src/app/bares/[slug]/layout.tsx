import { getBarBySlug } from "@/actions";
import { CartProvider } from "@/data/cart/CartContext";
import { CartButton } from "@/components/shared/CartButton";

export default async function BarSlugLayout(
  props: Readonly<{ children: React.ReactNode; params: Promise<{ slug: string }> }>,
) {
  const { slug } = await props.params;
  const bar = await getBarBySlug(slug);

  return (
    <CartProvider barSlug={slug}>
      {props.children}
      {bar?.deliveryEnabled && <CartButton slug={slug} />}
    </CartProvider>
  );
}

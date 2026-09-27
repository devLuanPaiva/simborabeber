import { notFound } from "next/navigation";
import { getPublicOrder } from "@/actions";
import { OrderTrackingView } from "./_components/OrderTrackingView";

export default async function OrderTrackingPage(
  props: Readonly<{ params: Promise<{ slug: string; orderId: string }> }>,
) {
  const { slug, orderId } = await props.params;
  const order = await getPublicOrder(orderId);

  if (!order) {
    return notFound();
  }

  return <OrderTrackingView slug={slug} initialOrder={order} />;
}

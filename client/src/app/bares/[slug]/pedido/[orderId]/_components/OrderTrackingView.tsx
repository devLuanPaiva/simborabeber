"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { connectOrderSocket } from "@/lib/socket/orderSocket";
import { formatCurrency } from "@/data/functions";
import {
  IOrder,
  OrderStatus,
  OrderStatusLabels,
  OrderType,
  PaymentMethodLabels,
} from "@/data/models";

interface OrderTrackingViewProps {
  slug: string;
  initialOrder: IOrder;
}

const DELIVERY_STEPS = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.COMPLETED,
];

const PICKUP_STEPS = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.COMPLETED,
];

export function OrderTrackingView({ slug, initialOrder }: Readonly<OrderTrackingViewProps>) {
  const [order, setOrder] = useState<IOrder>(initialOrder);

  useEffect(() => {
    const socket = connectOrderSocket();

    socket.on("connect", () => {
      socket.emit("join_order", initialOrder.id);
    });

    socket.on("order_status_updated", (payload: { order: IOrder }) => {
      if (payload?.order?.id === initialOrder.id) {
        setOrder(payload.order);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialOrder.id]);

  const isCancelled = order.status === OrderStatus.CANCELLED;
  const steps = order.type === OrderType.DELIVERY ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <main className="min-h-screen pb-16">
      <header className="sticky top-0 z-10 bg-white border-b border-[#BFAE99]/30 flex items-center gap-3 p-4">
        <Link href={`/bares/${slug}`} aria-label="Voltar ao cardápio">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-zinc-800">Acompanhar pedido</h1>
      </header>

      <div className="w-11/12 max-w-2xl mx-auto mt-8 space-y-6">
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center font-semibold">
            Este pedido foi cancelado.
          </div>
        ) : (
          <ol className="space-y-4">
            {steps.map((step, index) => {
              const isDone = index <= currentStepIndex;
              return (
                <li key={step} className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-[#F2A20C]" />
                  ) : (
                    <Circle size={22} className="text-zinc-300" />
                  )}
                  <span className={isDone ? "font-semibold text-zinc-800" : "text-zinc-400"}>
                    {OrderStatusLabels[step]}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 space-y-2">
          <h2 className="font-semibold text-zinc-800 mb-2">Itens do pedido</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-zinc-600">
              <span>
                {item.quantity}x {item.name}
                {item.notes ? ` (${item.notes})` : ""}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-zinc-500 pt-2 border-t border-[#BFAE99]/20">
              <span>Taxa de entrega</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold text-[#F2A20C] pt-2 border-t border-[#BFAE99]/20">
            <span>Total</span>
            <span>{formatCurrency(order.totalValue)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 space-y-1 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-800">Pagamento:</span>{" "}
            {PaymentMethodLabels[order.paymentMethod]}
          </p>
          {order.type === OrderType.DELIVERY && order.deliveryAddress && (
            <p>
              <span className="font-semibold text-zinc-800">Endereço:</span> {order.deliveryAddress}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

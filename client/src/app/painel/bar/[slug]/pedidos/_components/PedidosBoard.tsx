"use client";

import { useEffect, useMemo, useState } from "react";
import { connectOrderSocket } from "@/lib/socket/orderSocket";
import { updateOrderStatus } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IOrder, OrderStatus, OrderStatusLabels } from "@/data/models";
import { ClipboardList } from "lucide-react";
import { OrderCard } from "./OrderCard";

interface PedidosBoardProps {
  slug: string;
  initialOrders: IOrder[];
  accessToken?: string;
}

const COLUMNS: OrderStatus[] = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.COMPLETED,
];

const MAX_COMPLETED_VISIBLE = 15;

export function PedidosBoard({ slug, initialOrders, accessToken }: Readonly<PedidosBoardProps>) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(COLUMNS[0]);

  useEffect(() => {
    const socket = connectOrderSocket(accessToken);

    socket.on("order_created", (payload: { order: IOrder }) => {
      setOrders((prev) => [payload.order, ...prev]);
      appToast.info(`Novo pedido de ${payload.order.customerName}`);
    });

    socket.on("order_status_updated", (payload: { order: IOrder }) => {
      setOrders((prev) => prev.map((o) => (o.id === payload.order.id ? { ...o, ...payload.order } : o)));
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  const handleChangeStatus = async (orderId: string, status: OrderStatus) => {
    const result = await updateOrderStatus(orderId, status, slug);
    if (!result.success) {
      appToast.error(result.error || "Erro ao atualizar pedido");
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<OrderStatus, IOrder[]>();
    COLUMNS.forEach((status) => map.set(status, []));

    orders
      .filter((order) => order.status !== OrderStatus.CANCELLED)
      .forEach((order) => {
        map.get(order.status)?.push(order);
      });

    map.set(OrderStatus.COMPLETED, (map.get(OrderStatus.COMPLETED) ?? []).slice(0, MAX_COMPLETED_VISIBLE));

    return map;
  }, [orders]);

  const activeOrders = grouped.get(activeStatus) ?? [];

  return (
    <div>
      <nav className="sticky top-0 z-10 -mx-1 bg-background/95 backdrop-blur-sm">
        <div className="flex overflow-x-auto gap-3 px-1 py-3 scrollbar-hide">
          {COLUMNS.map((status) => {
            const count = grouped.get(status)?.length ?? 0;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  status === activeStatus
                    ? "bg-[#F28B0C] text-white shadow-sm"
                    : "bg-[#F2BE5C] text-white hover:bg-[#F28B0C]"
                }`}
              >
                {OrderStatusLabels[status]}
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${
                    status === activeStatus ? "bg-white/25" : "bg-black/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="space-y-3 mt-1">
        {activeOrders.map((order) => (
          <OrderCard key={order.id} order={order} onChangeStatus={handleChangeStatus} />
        ))}
        {activeOrders.length === 0 && (
          <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-10 flex flex-col items-center text-center gap-3">
            <div className="bg-[#F2BE5C]/30 p-4 rounded-full">
              <ClipboardList size={28} className="text-[#F28B0C]" />
            </div>
            <h3 className="font-semibold text-zinc-700">
              Nenhum pedido em &ldquo;{OrderStatusLabels[activeStatus]}&rdquo;
            </h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              Assim que um pedido entrar nesse status, ele aparece aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

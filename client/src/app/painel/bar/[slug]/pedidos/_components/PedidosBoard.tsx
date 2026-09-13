"use client";

import { useEffect, useMemo, useState } from "react";
import { connectOrderSocket } from "@/lib/socket/orderSocket";
import { updateOrderStatus } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IOrder, OrderStatus, OrderStatusLabels } from "@/data/models";
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

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const columnOrders = grouped.get(status) ?? [];
        return (
          <div key={status} className="min-w-[280px] w-[280px] flex-shrink-0">
            <h2 className="font-semibold text-zinc-700 mb-3 flex items-center justify-between">
              {OrderStatusLabels[status]}
              <span className="text-xs bg-zinc-200 text-zinc-600 rounded-full px-2 py-0.5">
                {columnOrders.length}
              </span>
            </h2>
            <div className="space-y-3">
              {columnOrders.map((order) => (
                <OrderCard key={order.id} order={order} onChangeStatus={handleChangeStatus} />
              ))}
              {columnOrders.length === 0 && (
                <p className="text-sm text-zinc-400 italic">Nenhum pedido</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { MessageCircle, MapPin, Store } from "lucide-react";
import { formatCurrency, formatDate, formatPhoneNumber, getNextOrderStatuses, openWhatsApp } from "@/data/functions";
import {
  IOrder,
  OrderStatus,
  OrderStatusLabels,
  OrderType,
  PaymentMethodLabels,
} from "@/data/models";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: IOrder;
  onChangeStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.PREPARING]: "Aceitar e preparar",
  [OrderStatus.READY]: "Marcar como pronto",
  [OrderStatus.OUT_FOR_DELIVERY]: "Saiu para entrega",
  [OrderStatus.COMPLETED]: "Concluir",
  [OrderStatus.CANCELLED]: "Cancelar pedido",
};

export function OrderCard({ order, onChangeStatus }: Readonly<OrderCardProps>) {
  const nextStatuses = getNextOrderStatuses(order);

  const handleWhatsApp = () => {
    openWhatsApp({
      phoneNumber: `+55${order.customerPhone.replace(/\D/g, "")}`,
      message: `Olá ${order.customerName}, sobre o seu pedido #${order.id.slice(0, 8)}...`,
    });
  };

  const handleChangeStatus = (status: OrderStatus) => {
    if (status === OrderStatus.CANCELLED) {
      const confirmed = window.confirm("Tem certeza que deseja cancelar este pedido?");
      if (!confirmed) return;
    }
    onChangeStatus(order.id, status);
  };

  return (
    <div className="bg-white rounded-xl border border-[#BFAE99]/20 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#F2BE5C]/30 text-[#F28B0C]">
          {OrderStatusLabels[order.status]}
        </span>
        <span className="text-xs text-zinc-500">{formatDate(order.createdAt)}</span>
      </div>

      <div>
        <p className="font-semibold text-zinc-800">{order.customerName}</p>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center gap-1 text-sm text-green-600 hover:underline"
        >
          <MessageCircle size={14} />
          {formatPhoneNumber(order.customerPhone)}
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-600">
        {order.type === OrderType.DELIVERY ? <MapPin size={14} /> : <Store size={14} />}
        {order.type === OrderType.DELIVERY ? order.deliveryAddress : "Retirada no local"}
      </div>

      <ul className="text-sm text-zinc-600 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="border-b border-dashed border-[#BFAE99]/30 pb-2 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-zinc-700">
                {item.quantity}x {item.name}
              </p>
              <span className="text-zinc-500 whitespace-nowrap">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>

            {item.components && item.components.length > 0 && (
              <ul className="mt-1 pl-4 text-xs text-zinc-500 list-disc space-y-0.5">
                {item.components.map((component, index) => (
                  <li key={index}>
                    {component.productName}
                    {component.variantLabel ? ` (${component.variantLabel})` : ""}
                  </li>
                ))}
              </ul>
            )}

            {item.addons && item.addons.length > 0 && (
              <p className="mt-1 pl-4 text-xs text-[#F28B0C]">
                + {item.addons.map((addon) => addon.name).join(", ")}
              </p>
            )}

            {item.notes && (
              <p className="mt-1 pl-4 text-xs italic text-zinc-400">Obs: {item.notes}</p>
            )}
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="text-sm bg-[#F2BE5C]/15 border border-[#F2BE5C]/40 rounded-lg p-2">
          <span className="font-semibold text-zinc-700">Observação geral: </span>
          <span className="text-zinc-600">{order.notes}</span>
        </div>
      )}

      {order.deliveryFee > 0 && (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>Taxa de entrega</span>
          <span>{formatCurrency(order.deliveryFee)}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-zinc-500 pt-2 border-t border-[#BFAE99]/20">
        <span>{PaymentMethodLabels[order.paymentMethod]}</span>
        <span className="font-bold text-[#F2A20C] text-base">{formatCurrency(order.totalValue)}</span>
      </div>

      {nextStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {nextStatuses.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === OrderStatus.CANCELLED ? "destructive" : "default"}
              className={status === OrderStatus.CANCELLED ? "" : "bg-[#F2A20C] hover:bg-[#F28B0C]"}
              onClick={() => handleChangeStatus(status)}
            >
              {STATUS_ACTION_LABELS[status]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

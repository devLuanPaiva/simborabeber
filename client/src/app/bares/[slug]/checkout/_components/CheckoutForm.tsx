"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/data/cart/CartContext";
import { createOrder } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { formatCurrency, formatPhoneNumber } from "@/data/functions";
import {
  OrderType,
  OrderTypeLabels,
  PaymentMethod,
  PaymentMethodLabels,
} from "@/data/models";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface CheckoutFormProps {
  slug: string;
  deliveryFee: number;
  minOrderValue: number;
}

export function CheckoutForm({ slug, deliveryFee, minOrderValue }: Readonly<CheckoutFormProps>) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [type, setType] = useState<OrderType>(OrderType.DELIVERY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [customerPhone, setCustomerPhone] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasPendingSize = items.some((item) => !!item.sizeOptions?.length);
  const missingForMinimum =
    type === OrderType.DELIVERY ? Math.max(0, minOrderValue - subtotal) : 0;
  const fee = type === OrderType.DELIVERY ? deliveryFee : 0;
  const total = subtotal + fee;
  const canSubmit = items.length > 0 && missingForMinimum === 0 && !hasPendingSize && !isPending;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-4">
        <h1 className="text-xl font-bold text-zinc-800">Seu carrinho está vazio</h1>
        <p className="text-zinc-500 max-w-sm">
          Volte ao cardápio e adicione produtos antes de finalizar o pedido.
        </p>
        <Link
          href={`/bares/${slug}`}
          className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Voltar ao cardápio
        </Link>
      </main>
    );
  }

  const handleSubmit = (formData: FormData) => {
    formData.set("type", type);
    formData.set("paymentMethod", paymentMethod);
    formData.set("items", JSON.stringify(items));

    startTransition(async () => {
      const result = await createOrder(formData, slug);

      if (!result.success) {
        appToast.error(result.error || "Erro ao criar pedido");
        return;
      }

      clear();
      appToast.success("Pedido enviado com sucesso!");
      router.push(`/bares/${slug}/pedido/${result.orderId}`);
    });
  };

  return (
    <main className="min-h-screen pb-32">
      <header className="sticky top-0 z-10 bg-white border-b border-[#BFAE99]/30 flex items-center gap-3 p-4">
        <button onClick={() => router.back()} aria-label="Voltar" type="button">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-zinc-800">Finalizar pedido</h1>
      </header>

      <form action={handleSubmit} className="w-11/12 max-w-2xl mx-auto mt-6 space-y-5">
        <div className="space-y-1">
          <Label className="text-sm text-zinc-600">Tipo de pedido</Label>
          <Select value={type} onValueChange={(val) => setType(val as OrderType)}>
            <SelectTrigger className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OrderTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="customerName" className="text-sm text-zinc-600">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input id="customerName" name="customerName" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="customerPhone" className="text-sm text-zinc-600">
            Telefone (com DDD) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            placeholder="(11) 99999-9999"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
            required
          />
        </div>

        {type === OrderType.DELIVERY && (
          <div className="space-y-1">
            <Label htmlFor="deliveryAddress" className="text-sm text-zinc-600">
              Endereço de entrega <span className="text-red-500">*</span>
            </Label>
            <Input id="deliveryAddress" name="deliveryAddress" required />
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-sm text-zinc-600">Forma de pagamento</Label>
          <Select
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
          >
            <SelectTrigger className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PaymentMethodLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes" className="text-sm text-zinc-600">
            Observação geral (opcional)
          </Label>
          <Textarea id="notes" name="notes" placeholder="Ex: tocar a campainha" />
        </div>

        <div className="bg-white rounded-xl border border-[#BFAE99]/20 p-4 space-y-2">
          <div className="flex justify-between text-zinc-700">
            <span>Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          {fee > 0 && (
            <div className="flex justify-between text-zinc-500 text-sm">
              <span>Taxa de entrega</span>
              <span>{formatCurrency(fee)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-[#F2A20C] pt-2 border-t border-[#BFAE99]/20">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {hasPendingSize && (
          <p className="text-sm text-red-500">
            Volte ao carrinho e escolha o tamanho de todos os itens antes de continuar.
          </p>
        )}

        {missingForMinimum > 0 && (
          <p className="text-sm text-red-500">
            Faltam {formatCurrency(missingForMinimum)} para atingir o pedido mínimo de{" "}
            {formatCurrency(minOrderValue)}.
          </p>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] text-white font-semibold py-6 rounded-full"
        >
          {isPending ? "Enviando pedido..." : "Confirmar pedido"}
        </Button>
      </form>
    </main>
  );
}

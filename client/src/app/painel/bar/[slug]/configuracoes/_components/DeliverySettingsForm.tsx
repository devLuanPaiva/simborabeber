"use client";

import { useState, useTransition } from "react";
import { updateDeliverySettings } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IBar } from "@/data/models";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DeliveryCityRow {
  name: string;
  fee: string;
}

interface DeliverySettingsFormProps {
  bar: IBar;
  slug: string;
}

export function DeliverySettingsForm({ bar, slug }: Readonly<DeliverySettingsFormProps>) {
  const [comandasEnabled, setComandasEnabled] = useState(bar.comandasEnabled);
  const [deliveryEnabled, setDeliveryEnabled] = useState(bar.deliveryEnabled);
  const [deliveryFee, setDeliveryFee] = useState(String(bar.deliveryFee ?? 0));
  const [minOrderValue, setMinOrderValue] = useState(String(bar.minOrderValue ?? 0));
  const [deliveryOriginAddress, setDeliveryOriginAddress] = useState(bar.deliveryOriginAddress ?? "");
  const [openingHours, setOpeningHours] = useState(bar.openingHours ?? "");
  const [deliveryCities, setDeliveryCities] = useState<DeliveryCityRow[]>(
    (bar.deliveryCities ?? []).map((city) => ({ name: city.name, fee: String(city.fee) })),
  );
  const [isPending, startTransition] = useTransition();

  const addDeliveryCityRow = () => setDeliveryCities((prev) => [...prev, { name: "", fee: "0" }]);
  const removeDeliveryCityRow = (index: number) =>
    setDeliveryCities((prev) => prev.filter((_, i) => i !== index));
  const updateDeliveryCityRow = (index: number, patch: Partial<DeliveryCityRow>) =>
    setDeliveryCities((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateDeliverySettings(bar.id, slug, {
        comandasEnabled,
        deliveryEnabled,
        deliveryFee: Number(deliveryFee) || 0,
        minOrderValue: Number(minOrderValue) || 0,
        deliveryOriginAddress: deliveryOriginAddress || undefined,
        openingHours: openingHours || undefined,
        deliveryCities: deliveryCities
          .filter((city) => city.name.trim())
          .map((city) => ({ name: city.name.trim(), fee: Number(city.fee) || 0 })),
      });

      if (!result.success) {
        appToast.error(result.error || "Erro ao salvar configurações");
        return;
      }

      appToast.success("Configurações salvas com sucesso");
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#BFAE99]/20 shadow-sm space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-zinc-800">Comandas</p>
          <p className="text-sm text-zinc-500">Controle de comandas via QR Code na mesa</p>
        </div>
        <Switch checked={comandasEnabled} onCheckedChange={setComandasEnabled} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-zinc-800">Delivery</p>
          <p className="text-sm text-zinc-500">
            Permite que clientes façam pedidos de delivery/retirada pelo cardápio público
          </p>
        </div>
        <Switch checked={deliveryEnabled} onCheckedChange={setDeliveryEnabled} />
      </div>

      {deliveryEnabled && (
        <div className="space-y-4 pt-4 border-t border-[#BFAE99]/20">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="deliveryFee">Taxa de entrega (R$)</Label>
              <Input
                id="deliveryFee"
                type="number"
                min="0"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="minOrderValue">Pedido mínimo (R$)</Label>
              <Input
                id="minOrderValue"
                type="number"
                min="0"
                step="0.01"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="deliveryOriginAddress">Endereço de origem</Label>
            <Input
              id="deliveryOriginAddress"
              value={deliveryOriginAddress}
              onChange={(e) => setDeliveryOriginAddress(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="openingHours">Horário de funcionamento</Label>
            <Input
              id="openingHours"
              placeholder="Ex: Ter-Dom, 18h-23h30"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
            />
          </div>

          <div className="space-y-2 pt-2">
            <div>
              <p className="font-semibold text-zinc-800">Cidades de entrega</p>
              <p className="text-sm text-zinc-500">
                Cidades vizinhas com uma taxa de entrega própria, diferente da taxa padrão acima
              </p>
            </div>

            {deliveryCities.map((city, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Nome da cidade"
                  value={city.name}
                  onChange={(e) => updateDeliveryCityRow(index, { name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Taxa (R$)"
                  value={city.fee}
                  onChange={(e) => updateDeliveryCityRow(index, { fee: e.target.value })}
                  className="w-28"
                />
                <button
                  type="button"
                  onClick={() => removeDeliveryCityRow(index)}
                  aria-label={`Remover ${city.name || "cidade"}`}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addDeliveryCityRow}
              className="flex items-center gap-1 text-sm font-semibold text-[#F2A20C] hover:text-[#F28B0C] cursor-pointer"
            >
              <Plus size={16} />
              Adicionar cidade
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={isPending}
        className="bg-[#F2A20C] hover:bg-[#F28B0C] text-white"
      >
        {isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </div>
  );
}

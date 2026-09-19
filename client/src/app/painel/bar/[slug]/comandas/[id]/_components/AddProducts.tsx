"use client";

import { useMemo, useState } from "react";
import { addTabItem, addTabItems, TabItemInput } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IProduct, IProductAddon } from "@/data/models";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/data/functions";
import { ProductImage } from "@/components/shared/ProductImage";

interface AddProductsProps {
  products: IProduct[];
  addonOptions: IProductAddon[];
  slug: string;
  tabId: string;
}

interface DraftLine {
  key: string;
  name: string;
  unitPrice: number;
  quantity: number;
  item: TabItemInput;
}

function sortedActiveVariants(product: IProduct) {
  return [...(product.variants ?? [])].filter((v) => v.isActive).sort((a, b) => a.price - b.price);
}

export function AddProducts({ products, addonOptions, slug, tabId }: Readonly<AddProductsProps>) {
  const [search, setSearch] = useState("");
  const [draftLines, setDraftLines] = useState<DraftLine[]>([]);
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string>("");
  const [extraProductId, setExtraProductId] = useState<string>("");
  const [addonIds, setAddonIds] = useState<string[]>([]);

  const filtered = products.filter((p: IProduct) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const configuringProduct = products.find((p) => p.id === configuringId) ?? null;
  const configuringVariants = configuringProduct ? sortedActiveVariants(configuringProduct) : [];
  const selectedVariant = configuringVariants.find((v) => v.id === variantId);

  const availableFlavors = useMemo(() => {
    if (!configuringProduct || !selectedVariant) return [];
    return products.filter(
      (p) =>
        p.id !== configuringProduct.id &&
        p.category === configuringProduct.category &&
        p.variants?.some((v) => v.isActive && v.label === selectedVariant.label),
    );
  }, [configuringProduct, products, selectedVariant]);

  const addonsForConfiguring = configuringProduct
    ? addonOptions.filter((a) => !a.category || a.category === configuringProduct.category)
    : [];

  const selectedAddons = addonOptions.filter((a) => addonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const configuringUnitPrice = (selectedVariant ? Number(selectedVariant.price) : Number(configuringProduct?.price ?? 0)) + addonsTotal;

  const resetConfiguring = () => {
    setConfiguringId(null);
    setVariantId("");
    setExtraProductId("");
    setAddonIds([]);
  };

  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const pushDraftLine = (line: DraftLine) => {
    setDraftLines((prev) => [...prev, line]);
  };

  const handleAddSimpleProduct = (product: IProduct) => {
    const key = product.id;
    const existing = draftLines.find((l) => l.key === key);
    if (existing) {
      setDraftLines((prev) => prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + 1, item: { ...l.item, quantity: l.quantity + 1 } } : l)));
      return;
    }

    pushDraftLine({
      key,
      name: product.name,
      unitPrice: Number(product.price ?? 0),
      quantity: 1,
      item: { productId: product.id, quantity: 1 },
    });
  };

  const handleStartConfiguring = (product: IProduct) => {
    setConfiguringId(product.id);
    setVariantId("");
    setExtraProductId("");
    setAddonIds([]);
  };

  const handleConfirmConfiguring = () => {
    if (!configuringProduct || !selectedVariant) return;

    const extraProduct = availableFlavors.find((p) => p.id === extraProductId);
    const name = extraProduct
      ? `${configuringProduct.name} / ${extraProduct.name} (${selectedVariant.label})`
      : `${configuringProduct.name} (${selectedVariant.label})`;

    pushDraftLine({
      key: `${configuringProduct.id}-${Date.now()}`,
      name,
      unitPrice: configuringUnitPrice,
      quantity: 1,
      item: {
        productId: configuringProduct.id,
        quantity: 1,
        variantId: selectedVariant.id,
        ...(extraProduct ? { extraProductId: extraProduct.id } : {}),
        ...(addonIds.length ? { addonIds } : {}),
      },
    });

    resetConfiguring();
  };

  const removeDraftLine = (key: string) => {
    setDraftLines((prev) => prev.filter((l) => l.key !== key));
  };

  const handleSubmit = async () => {
    if (draftLines.length === 0) return;

    if (draftLines.length === 1) {
      const res = await addTabItem({ slug, tabId, item: draftLines[0].item });
      if (res?.success) {
        appToast.success(res.message || "Item adicionado com sucesso");
        setDraftLines([]);
      } else {
        appToast.error(res?.error || "Erro ao adicionar item");
      }
      return;
    }

    const res = await addTabItems({ slug, tabId, items: draftLines.map((l) => l.item) });
    if (res?.success) {
      appToast.success(res.message || "Itens adicionados com sucesso");
      setDraftLines([]);
    } else {
      appToast.error(res?.error || "Erro ao adicionar itens");
    }
  };

  return (
    <section className="bg-white p-4 rounded-xl border border-[#BFAE99]/20 space-y-3">
      <h3 className="font-bold text-zinc-800">Adicionar Produtos</h3>
      <input
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="space-y-2 max-h-137.5 overflow-y-auto divide-y-4 divide-slate-200">
        {filtered.map((product: IProduct) => {
          const hasVariants = sortedActiveVariants(product).length > 0;
          const isConfiguring = configuringId === product.id;

          return (
            <div key={product.id} className="py-2 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-zinc-100">
                    <ProductImage src={product.image} alt={product.name} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-zinc-500">
                      {hasVariants && <span>a partir de </span>}
                      {formatCurrency(Number(sortedActiveVariants(product)[0]?.price ?? product.price ?? 0))}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => (hasVariants ? handleStartConfiguring(product) : handleAddSimpleProduct(product))}
                  className="p-2 bg-[#F2A20C] hover:bg-[#F28B0C] text-white rounded-md cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              {isConfiguring && (
                <div className="bg-[#F2F2F2] rounded-lg p-3 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-zinc-700">Escolha o tamanho</p>
                    <div className="flex flex-wrap gap-2">
                      {configuringVariants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            setVariantId(variant.id);
                            setExtraProductId("");
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                            variant.id === variantId
                              ? "bg-[#F2A20C] text-white border-[#F2A20C]"
                              : "bg-white text-zinc-700 border-[#BFAE99]/40"
                          }`}
                        >
                          {variant.label} · {formatCurrency(Number(variant.price))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedVariant && availableFlavors.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-700">Segundo sabor (opcional)</p>
                      <select
                        value={extraProductId}
                        onChange={(e) => setExtraProductId(e.target.value)}
                        className="w-full border border-[#BFAE99]/50 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Só {configuringProduct?.name}</option>
                        {availableFlavors.map((flavor) => (
                          <option key={flavor.id} value={flavor.id}>
                            {flavor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedVariant && addonsForConfiguring.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-700">Adicionais</p>
                      <div className="space-y-1.5">
                        {addonsForConfiguring.map((addon) => (
                          <label
                            key={addon.id}
                            className="flex items-center justify-between gap-3 bg-white border border-[#BFAE99]/30 rounded-lg px-3 py-1.5 cursor-pointer"
                          >
                            <span className="flex items-center gap-2 text-xs text-zinc-700">
                              <input
                                type="checkbox"
                                checked={addonIds.includes(addon.id)}
                                onChange={() => toggleAddon(addon.id)}
                                className="accent-[#F2A20C]"
                              />
                              {addon.name}
                            </span>
                            <span className="text-xs font-semibold text-[#F2A20C]">
                              + {formatCurrency(Number(addon.price))}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleConfirmConfiguring}
                      disabled={!selectedVariant}
                      className="flex-1 bg-[#F2A20C] hover:bg-[#F28B0C] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold cursor-pointer"
                    >
                      Adicionar {selectedVariant && `· ${formatCurrency(Number(configuringUnitPrice))}`}
                    </button>
                    <button
                      type="button"
                      onClick={resetConfiguring}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-[#BFAE99]/40 text-zinc-700 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {draftLines.length > 0 && (
        <div className="space-y-2 border-t border-[#BFAE99]/20 pt-3">
          <p className="text-sm font-semibold text-zinc-700">Itens selecionados</p>
          {draftLines.map((line) => (
            <div
              key={line.key}
              className="flex items-center justify-between gap-2 bg-[#F2F2F2] rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  {line.quantity}x {line.name}
                </p>
                <p className="text-xs text-zinc-500">{formatCurrency(Number(line.unitPrice))}</p>
              </div>
              <button
                type="button"
                onClick={() => removeDraftLine(line.key)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                aria-label={`Remover ${line.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] cursor-pointer text-white py-2 rounded-lg"
          >
            Adicionar itens
          </button>
        </div>
      )}
    </section>
  );
}

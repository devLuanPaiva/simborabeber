"use client";

import {
  IProduct,
  ProductCategory,
  ProductCategoryLabels,
} from "@/data/models";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import CurrencyInput from "../shared/CurrencyInput";

interface ProductDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  editingProduct: IProduct | null;
  formData: Partial<IProduct>;
  setFormData: (data: Partial<IProduct>) => void;
  handleSave: () => void;
}

export function ProductDialog({
  showDialog,
  setShowDialog,
  editingProduct,
  formData,
  setFormData,
  handleSave,
}: Readonly<ProductDialogProps>) {
  const handleToggleMenu = (checked: boolean) => {
    setFormData({ ...formData, showInMenu: checked });
  };

  const handleToggleInventory = (checked: boolean) => {
    if (formData.establishmentProducts?.[0]) {
      const updated = {
        ...formData,
        establishmentProducts: [
          {
            ...formData.establishmentProducts[0],
            trackInventory: checked,
          },
        ],
      };
      setFormData(updated);
    } else {
      setFormData({
        ...formData,
        establishmentProducts: [
          {
            establishmentId: "",
            price: formData.salePrice || 0,
            trackInventory: checked,
            available: true,
            createdAt: new Date(),
            id: "",
            productId: "",
          },
        ],
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>Preencha os dados do produto</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-2"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-2"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category ?? ""}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as ProductCategory })
              }
            >
              <SelectTrigger className=" w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Valor de Compra</Label>
            <CurrencyInput
              value={formData.purchasePrice ?? 0}
              setValue={(v) =>
                setFormData({
                  ...formData,
                  purchasePrice: typeof v === "object" ? v.target_value : v,
                })
              }
              idInput="purchase-price"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Valor de Venda *</Label>
            <CurrencyInput
              value={formData.salePrice ?? 0}
              setValue={(v) => {
                const sale = typeof v === "object" ? v.target_value : v;
                if (formData.establishmentProducts?.[0]) {
                  setFormData({
                    ...formData,
                    salePrice: sale,
                    establishmentProducts: [
                      { ...formData.establishmentProducts[0], price: sale },
                    ],
                  });
                } else {
                  setFormData({ ...formData, salePrice: sale });
                }
              }}
              idInput="sale-price"
            />
          </div>

          {formData.establishmentProducts?.[0]?.trackInventory && (
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque Inicial *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.productStocks?.[0]?.quantity?.toString() ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productStocks: [
                      {
                        id: formData.productStocks?.[0]?.id ?? "",
                        establishmentId:
                          formData.productStocks?.[0]?.establishmentId ?? "",
                        productId: formData.id ?? "",
                        quantity: Number(e.target.value),
                        updatedAt: new Date(),
                      },
                    ],
                  })
                }
                className="mt-2"
              />
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Mostrar no menu</Label>
            <Switch
              checked={formData.showInMenu ?? false}
              onCheckedChange={handleToggleMenu}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Controlar estoque</Label>
            <Switch
              checked={
                formData.establishmentProducts?.[0]?.trackInventory ?? false
              }
              onCheckedChange={handleToggleInventory}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Produto</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

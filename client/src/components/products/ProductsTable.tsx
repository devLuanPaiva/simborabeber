import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { IProduct } from "@/data/models";
import { formatCurrency } from "@/data/functions";

interface ProductsTableProps {
  filteredProducts: IProduct[];
  handleOpenDialog: (product: IProduct) => void;
  setProductToDelete: (id: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
}
export function ProductsTable({
  filteredProducts,
  handleOpenDialog,
  setProductToDelete,
  setShowDeleteDialog,
}: Readonly<ProductsTableProps>) {
  const getStockColor = (stock: number) => {
    if (stock < 10) return "bg-red-500/10 text-red-700 border-red-500/20";
    if (stock < 30)
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-green-500/10 text-green-700 border-green-500/20";
  };

  return (
    <section className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Venda</TableHead>
            <TableHead>Margem</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => {
            const margin =
              ((product.salePrice - (product.purchasePrice || 0)) /
                product.salePrice) *
              100;
            const stockQuantity = product.productStocks?.[0]?.quantity ?? 0;
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <p>{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {formatCurrency(product.purchasePrice || 0)}
                </TableCell>
                <TableCell className="text-primary">
                  {formatCurrency(product.salePrice || 0)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-700 border-green-500/20"
                  >
                    {margin.toFixed(0)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStockColor(stockQuantity)}
                  >
                    {stockQuantity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(product)}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive cursor-pointer"
                      onClick={() => {
                        setProductToDelete(product.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

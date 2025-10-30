import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface ProductPageHeaderProps {
  handleOpenDialog: () => void;
}
export function ProductPageHeader({
  handleOpenDialog,
}: Readonly<ProductPageHeaderProps>) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl mb-2">Produtos</h1>
        <p className="text-muted-foreground">
          Gerenciamento do cardápio e produtos
        </p>
      </div>
      <Button
        onClick={() => handleOpenDialog()}
        className="gap-2 cursor-pointer"
      >
        <Plus className="h-5 w-5 " />
        Novo Produto
      </Button>
    </header>
  );
}

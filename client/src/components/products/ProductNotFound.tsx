import { PackageX } from "lucide-react";
export function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 ">
      <PackageX className="w-24 h-24 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">
        Nenhum produto encontrado!
      </h2>
      <p className="text-muted-foreground">
        Parece que ainda não há produtos cadastrados. Comece adicionando novos
        produtos para gerenciar seu cardápio.
      </p>
    </div>
  );
}

import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface ProductsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function ProductsSearch({
  searchTerm,
  setSearchTerm,
}: Readonly<ProductsSearchProps>) {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}

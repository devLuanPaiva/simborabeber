import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface BackLinkProps {
  slug: string;
  label: string;
  actions?: ReactNode;
}
export function BackLink({ slug, label, actions }: Readonly<BackLinkProps>) {
  return (
    <div className="mx-auto w-11/12 max-w-7xl flex justify-between items-center gap-3 py-6">
      <Link
        href={`/${slug}`}
        className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white cursor-pointer px-3 py-1 rounded-md text-sm font-medium"
      >
        <ChevronLeft /> {label}
      </Link>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

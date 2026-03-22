import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackLinkProps {
  slug: string;
  label: string;
}
export function BackLink({ slug, label }: Readonly<BackLinkProps>) {
  return (
    <div className="mx-auto w-11/12 max-w-7xl flex justify-start py-6">
      <Link
        href={`/${slug}`}
        className="flex items-center gap-1 bg-[#F2A20C] hover:bg-[#F28B0C] text-white cursor-pointer px-3 py-1 rounded-md text-sm font-medium"
      >
        <ChevronLeft /> {label}
      </Link>
    </div>
  );
}

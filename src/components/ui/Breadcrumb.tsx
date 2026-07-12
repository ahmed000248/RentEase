import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/25" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-white/50 hover:text-brand-green transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white/80 font-medium truncate max-w-[220px] sm:max-w-none" : "text-white/50"}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { usePages, usePage } from "@/hooks/usePages";
import { extractPlainText } from "@/lib/extractPlainText";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpaceListItem } from "@/types/space";

interface SpacePreviewCardProps {
  space: SpaceListItem;
}

export function SpacePreviewCard({ space }: SpacePreviewCardProps) {
  const { data: pages, isLoading: pagesLoading } = usePages(space.id);

  const sortedPages = pages
    ? [...pages].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const firstPageId = sortedPages[0]?.id;

  const { data: firstPage } = usePage(firstPageId ?? 0);

  const preview = firstPage ? extractPlainText(firstPage.content, 150) : "";

  return (
    <Link
      to={`/spaces/${space.id}`}
      className="group block rounded-2xl border border-border bg-background overflow-hidden transition-shadow hover:shadow-md"
    >
      {/* Preview area */}
      <div className="h-24 bg-muted/50 px-4 pt-3 overflow-hidden relative">
        {pagesLoading ? (
          <Skeleton className="h-full w-full" />
        ) : preview ? (
          <p className="text-[10px] leading-relaxed text-muted-foreground/70 line-clamp-5">
            {preview}
          </p>
        ) : (
          <div className="flex items-center justify-center h-full">
            <FileText className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {space.icon && (
            <IconRenderer
              icon={space.icon}
              iconColor={space.iconColor}
              size={18}
              className="shrink-0 translate-y-2.5"
            />
          )}
          <h2 className="font-medium truncate">{space.title}</h2>
        </div>
        {space.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {space.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          <span>
            {space.pageCount === 0
              ? "Nenhuma pagina"
              : space.pageCount === 1
                ? "1 pagina"
                : `${space.pageCount} paginas`}
          </span>
        </div>
      </div>
    </Link>
  );
}

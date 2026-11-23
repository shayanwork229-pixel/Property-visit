import { Heart, Scale } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { MAX_COMPARE, useCompare, useFavorites } from "@/lib/saved-store";

export function FavoriteButton({ id, className, withLabel }: { id: string; className?: string; withLabel?: boolean }) {
  const fav = useFavorites();
  const active = fav.has(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = fav.toggle(id);
        toast.success(added ? "Saved to favourites" : "Removed from favourites");
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favourites" : "Save to favourites"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all",
        active ? "text-destructive" : "text-navy hover:text-destructive",
        className,
      )}
    >
      <Heart className={cn("size-[18px]", active && "fill-current")} />
      {withLabel && <span className="text-sm font-semibold">{active ? "Saved" : "Save"}</span>}
    </button>
  );
}

export function CompareButton({ id, className, withLabel }: { id: string; className?: string; withLabel?: boolean }) {
  const cmp = useCompare();
  const active = cmp.has(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = cmp.toggle(id);
        if (r === "full") toast.error(`You can compare up to ${MAX_COMPARE} properties`);
        else toast.success(r === "added" ? "Added to compare" : "Removed from compare");
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all",
        active ? "text-primary" : "text-navy hover:text-primary",
        className,
      )}
    >
      <Scale className="size-[18px]" />
      {withLabel && <span className="text-sm font-semibold">{active ? "Comparing" : "Compare"}</span>}
    </button>
  );
}

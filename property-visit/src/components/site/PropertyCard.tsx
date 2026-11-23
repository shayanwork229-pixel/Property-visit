import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bath, BedDouble, CalendarCheck, ChevronLeft, ChevronRight, MapPin, Ruler, Star } from "lucide-react";
import { useState } from "react";

import { CompareButton, FavoriteButton } from "./SaveButtons";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/data/categories";
import { findCity } from "@/data/locations";
import type { Property } from "@/data/types";
import { formatPKR, formatSize } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const [idx, setIdx] = useState(0);
  const city = findCity(property.citySlug);
  const count = property.images.length;
  const go = (d: number) => setIdx((i) => (i + d + count) % count);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link to="/property/$slug" params={{ slug: property.slug }} aria-label={property.title}>
          <img
            src={property.images[idx]}
            alt={`${property.title} – photo ${idx + 1}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-card-fade opacity-60" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {property.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
              <Star className="size-3 fill-current" /> Featured
            </span>
          )}
          {property.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-success-foreground">
              <BadgeCheck className="size-3" /> Verified
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <CompareButton id={property.id} className="size-9 bg-background/95 shadow-card" />
          <FavoriteButton id={property.id} className="size-9 bg-background/95 shadow-card" />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-navy opacity-0 shadow-card transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-navy opacity-0 shadow-card transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {property.images.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 rounded-full bg-on-dark transition-all", i === idx ? "w-4" : "w-1.5 opacity-60")}
                />
              ))}
            </div>
          </>
        )}
        <span className="absolute bottom-3 left-3 rounded-md bg-navy/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-on-dark backdrop-blur">
          For {property.purpose === "buy" ? "Sale" : "Rent"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xl font-extrabold text-primary">{formatPKR(property.price, property.purpose)}</p>
          <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">
            {categoryLabel(property.type)}
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-1 text-base font-bold text-foreground">
          <Link to="/property/$slug" params={{ slug: property.slug }} className="hover:text-primary">
            {property.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.block}, {property.area}, {city?.name}
          </span>
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-foreground">
          {property.beds > 0 && (
            <span className="flex items-center gap-1.5" title="Bedrooms">
              <BedDouble className="size-4 text-muted-foreground" /> {property.beds}
            </span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1.5" title="Bathrooms">
              <Bath className="size-4 text-muted-foreground" /> {property.baths}
            </span>
          )}
          <span className="flex items-center gap-1.5" title="Area">
            <Ruler className="size-4 text-muted-foreground" /> {formatSize(property.size.value, property.size.unit)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="h-10">
            <Link to="/property/$slug" params={{ slug: property.slug }}>
              View Details
            </Link>
          </Button>
          <Button asChild size="sm" className="h-10">
            <Link to="/property/$slug" params={{ slug: property.slug }} hash="visit">
              <CalendarCheck /> Schedule Visit
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

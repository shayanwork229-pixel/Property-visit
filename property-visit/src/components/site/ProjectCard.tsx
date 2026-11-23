import { Link } from "@tanstack/react-router";
import { Building, CalendarClock, MapPin } from "lucide-react";

import { findCity } from "@/data/locations";
import type { Project } from "@/data/types";
import { formatPKR } from "@/lib/format";
import { whatsappLink, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function ProjectCard({ project: p }: { project: Project }) {
  const city = findCity(p.citySlug);
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated sm:grid-cols-[1fr_1.1fr]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
        <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-gold-foreground">{p.status}</span>
      </div>
      <div className="flex flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.developer}</p>
        <h3 className="mt-1 text-xl font-bold text-navy">{p.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" /> {p.area}, {city?.name}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.types.map((t) => (
            <span key={t} className="rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">{t}</span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Starting from</p>
            <p className="text-lg font-extrabold text-primary">{formatPKR(p.startingPrice)}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3" /> Completion: {p.completion}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/properties" search={{ city: p.citySlug, area: p.area }}>
                <Building /> Nearby
              </Link>
            </Button>
            <Button asChild size="sm">
              <a href={whatsappLink(SITE.phone, `Hi, I'd like details and a site visit for ${p.name} (${city?.name}).`)} target="_blank" rel="noreferrer">
                Enquire
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

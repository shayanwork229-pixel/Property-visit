import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/data/categories";
import { PROVINCES, areasForCity } from "@/data/locations";
import type { PropertyType } from "@/data/types";
import { BUY_PRICE_RANGES, RENT_PRICE_RANGES } from "@/lib/listing";
import { cn } from "@/lib/utils";

type Tab = "buy" | "rent" | "projects";
const ANY = "any";

export function HeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("buy");
  const [city, setCity] = useState(ANY);
  const [area, setArea] = useState(ANY);
  const [type, setType] = useState(ANY);
  const [price, setPrice] = useState(ANY);
  const [beds, setBeds] = useState(ANY);

  const ranges = tab === "rent" ? RENT_PRICE_RANGES : BUY_PRICE_RANGES;
  const areas = areasForCity(city === ANY ? undefined : city);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const c = city === ANY ? undefined : city;
    if (tab === "projects") {
      navigate({ to: "/projects", search: { city: c } });
      return;
    }
    const range = price === ANY ? undefined : ranges[Number(price)];
    navigate({
      to: tab === "buy" ? "/buy" : "/rent",
      search: {
        city: c,
        area: area === ANY ? undefined : area,
        type: type === ANY ? undefined : (type as PropertyType),
        minPrice: range?.min,
        maxPrice: range?.max,
        beds: beds === ANY ? undefined : Number(beds),
      },
    });
  }

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-2xl border border-on-dark/15 bg-background p-2 shadow-elevated"
      aria-label="Property search"
    >
      <div className="flex gap-1 p-1" role="tablist">
        {(["buy", "rent", "projects"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => {
              setTab(t);
              setPrice(ANY);
            }}
            className={cn(
              "rounded-lg px-5 py-2 text-sm font-bold capitalize transition-colors",
              tab === t ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:bg-accent hover:text-navy",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "grid gap-2 p-2 sm:grid-cols-2",
          tab === "projects" ? "lg:grid-cols-[1fr_auto]" : "lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_0.8fr_auto]",
        )}
      >
        <Field label="City">
          <Select
            value={city}
            onValueChange={(v) => {
              setCity(v);
              setArea(ANY);
            }}
          >
            <SelectTrigger className="h-11 border-0 bg-muted px-3 font-medium shadow-none" aria-label="City">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value={ANY}>All cities</SelectItem>
              {PROVINCES.map((p) => (
                <SelectGroup key={p.slug}>
                  <SelectLabel className="text-xs text-muted-foreground">{p.name}</SelectLabel>
                  {p.cities.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {tab !== "projects" && (
          <>
            <Field label="Area / Location">
              <Select value={area} onValueChange={setArea} disabled={areas.length === 0}>
                <SelectTrigger className="h-11 border-0 bg-muted px-3 font-medium shadow-none" aria-label="Area">
                  <SelectValue placeholder={city === ANY ? "Select a city first" : "All areas"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>{city === ANY ? "Select a city first" : "All areas"}</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.name} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Property Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 border-0 bg-muted px-3 font-medium shadow-none" aria-label="Property type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>All types</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.type} value={c.type}>
                      {c.plural}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Price Range">
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="h-11 border-0 bg-muted px-3 font-medium shadow-none" aria-label="Price range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any price</SelectItem>
                  {ranges.map((r, i) => (
                    <SelectItem key={r.label} value={String(i)}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bedrooms">
              <Select value={beds} onValueChange={setBeds}>
                <SelectTrigger className="h-11 border-0 bg-muted px-3 font-medium shadow-none" aria-label="Bedrooms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any</SelectItem>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}+ Beds
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button type="submit" size="xl" className="h-11 w-full px-7 shadow-glow">
            <Search /> Search
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

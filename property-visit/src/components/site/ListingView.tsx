import { Link } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PropertyCard } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/data/categories";
import { PROVINCES, areasForCity, citiesForProvince, findCity } from "@/data/locations";
import { PROPERTIES } from "@/data/properties";
import type { PropertyType, Purpose } from "@/data/types";
import { formatPKR } from "@/lib/format";
import { filterProperties, sortProperties, type ListingSearch, type SortKey } from "@/lib/listing";
import { cn } from "@/lib/utils";

const ANY = "any";
const BUY_STEPS = [2_500_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 50_000_000, 100_000_000, 200_000_000, 500_000_000];
const RENT_STEPS = [25_000, 50_000, 100_000, 150_000, 200_000, 300_000, 500_000, 1_000_000];
const SIZE_STEPS = [
  { v: 3, label: "3 Marla+" },
  { v: 5, label: "5 Marla+" },
  { v: 7, label: "7 Marla+" },
  { v: 10, label: "10 Marla+" },
  { v: 20, label: "1 Kanal+" },
  { v: 40, label: "2 Kanal+" },
];

export type SearchPatch = Partial<Record<keyof ListingSearch, ListingSearch[keyof ListingSearch] | undefined>>;

interface Props {
  search: ListingSearch;
  fixedPurpose?: Purpose;
  onChange: (patch: SearchPatch) => void;
  onReset: () => void;
}

export function ListingView({ search, fixedPurpose, onChange, onReset }: Props) {
  const effective: ListingSearch = fixedPurpose ? { ...search, purpose: fixedPurpose } : search;
  const results = useMemo(
    () => sortProperties(filterProperties(PROPERTIES, effective), effective.sort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(effective)],
  );
  const activeCount = Object.keys(search).filter((k) => k !== "sort").length;
  const city = findCity(search.city);

  const filters = <Filters search={effective} fixedPurpose={fixedPurpose} onChange={onChange} />;

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-navy">
              <SlidersHorizontal className="size-4" /> Filters
            </h2>
            {activeCount > 0 && (
              <button onClick={onReset} className="text-xs font-semibold text-primary hover:underline">
                Clear all
              </button>
            )}
          </div>
          {filters}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="text-lg font-bold text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "property" : "properties"} found
            {city && <> in {city.name}</>}
          </p>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal /> Filters
                  {activeCount > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeCount}</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  {filters}
                  {activeCount > 0 && (
                    <Button variant="outline" className="mt-4 w-full" onClick={onReset}>
                      <X /> Clear all filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Select value={effective.sort ?? "newest"} onValueChange={(v) => onChange({ sort: v as SortKey })}>
              <SelectTrigger className="h-9 w-[190px] bg-card" aria-label="Sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-bold">No properties match these filters</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different city, widen the price range or clear some filters.
            </p>
            <div className="mt-6 flex gap-2">
              <Button onClick={onReset}>Clear filters</Button>
              <Button asChild variant="outline">
                <Link to="/properties">Browse all</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Filters({
  search,
  fixedPurpose,
  onChange,
}: {
  search: ListingSearch;
  fixedPurpose?: Purpose;
  onChange: (patch: SearchPatch) => void;
}) {
  const [q, setQ] = useState(search.q ?? "");
  useEffect(() => setQ(search.q ?? ""), [search.q]);

  const cities = citiesForProvince(search.province);
  const areas = areasForCity(search.city);
  const steps = search.purpose === "rent" ? RENT_STEPS : BUY_STEPS;

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onChange({ q: q.trim() || undefined });
        }}
      >
        <Label htmlFor="q" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Search location
        </Label>
        <div className="flex gap-2">
          <Input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Phase 6, Clifton, Lake City"
            className="h-10"
            maxLength={80}
          />
          <Button type="submit" size="sm" className="h-10">
            Go
          </Button>
        </div>
      </form>

      {!fixedPurpose && (
        <div>
          <FilterLabel>Purpose</FilterLabel>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {([undefined, "buy", "rent"] as const).map((p) => (
              <button
                key={p ?? "all"}
                type="button"
                onClick={() => onChange({ purpose: p, minPrice: undefined, maxPrice: undefined })}
                className={cn(
                  "rounded-md py-1.5 text-sm font-semibold transition-colors",
                  search.purpose === p ? "bg-background text-primary shadow-sm" : "text-muted-foreground",
                )}
              >
                {p === undefined ? "All" : p === "buy" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
        </div>
      )}

      <SelectFilter
        label="Province"
        value={search.province}
        onChange={(v) => onChange({ province: v, city: undefined, area: undefined })}
        options={PROVINCES.map((p) => ({ value: p.slug, label: p.name }))}
        anyLabel="All provinces"
      />
      <SelectFilter
        label="City"
        value={search.city}
        onChange={(v) => onChange({ city: v, area: undefined })}
        options={cities.map((c) => ({ value: c.slug, label: c.name }))}
        anyLabel="All cities"
      />
      <SelectFilter
        label="Area"
        value={search.area}
        onChange={(v) => onChange({ area: v })}
        options={areas.map((a) => ({ value: a.name, label: a.name }))}
        anyLabel={search.city ? "All areas" : "Select a city first"}
        disabled={!search.city}
      />
      <SelectFilter
        label="Property type"
        value={search.type}
        onChange={(v) => onChange({ type: v as PropertyType | undefined })}
        options={CATEGORIES.map((c) => ({ value: c.type, label: c.plural }))}
        anyLabel="All types"
      />
      <div className="grid grid-cols-2 gap-2">
        <SelectFilter
          label="Min price"
          value={search.minPrice?.toString()}
          onChange={(v) => onChange({ minPrice: v ? Number(v) : undefined })}
          options={steps.map((s) => ({ value: String(s), label: formatPKR(s).replace("PKR ", "") }))}
          anyLabel="No min"
        />
        <SelectFilter
          label="Max price"
          value={search.maxPrice?.toString()}
          onChange={(v) => onChange({ maxPrice: v ? Number(v) : undefined })}
          options={steps.map((s) => ({ value: String(s), label: formatPKR(s).replace("PKR ", "") }))}
          anyLabel="No max"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SelectFilter
          label="Bedrooms"
          value={search.beds?.toString()}
          onChange={(v) => onChange({ beds: v ? Number(v) : undefined })}
          options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` }))}
          anyLabel="Any"
        />
        <SelectFilter
          label="Bathrooms"
          value={search.baths?.toString()}
          onChange={(v) => onChange({ baths: v ? Number(v) : undefined })}
          options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` }))}
          anyLabel="Any"
        />
      </div>
      <SelectFilter
        label="Area size"
        value={search.minSize?.toString()}
        onChange={(v) => onChange({ minSize: v ? Number(v) : undefined })}
        options={SIZE_STEPS.map((s) => ({ value: String(s.v), label: s.label }))}
        anyLabel="Any size"
      />
      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5">
        <span className="text-sm font-semibold">Verified only</span>
        <Switch checked={!!search.verified} onCheckedChange={(c) => onChange({ verified: c ? true : undefined })} />
      </label>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</span>;
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
  anyLabel,
  disabled,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
  anyLabel: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <FilterLabel>{label}</FilterLabel>
      <Select value={value ?? ANY} onValueChange={(v) => onChange(v === ANY ? undefined : v)} disabled={disabled}>
        <SelectTrigger className="h-10 w-full" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import type { Property, PropertyType, Purpose } from "@/data/types";
import { toMarla } from "./format";

export type SortKey = "newest" | "price-asc" | "price-desc";

export interface ListingSearch {
  purpose?: Purpose;
  province?: string;
  city?: string;
  area?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minSize?: number; // in Marla
  verified?: boolean;
  agent?: string;
  q?: string;
  sort?: SortKey;
}

const TYPES: PropertyType[] = [
  "house",
  "apartment",
  "plot",
  "commercial",
  "shop",
  "office",
  "farmhouse",
  "warehouse",
];
const SORTS: SortKey[] = ["newest", "price-asc", "price-desc"];

function str(v: unknown) {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function num(v: unknown) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Validates raw URL search params into a typed, safe ListingSearch. */
export function parseListingSearch(raw: Record<string, unknown>): ListingSearch {
  const purpose = raw.purpose === "buy" || raw.purpose === "rent" ? raw.purpose : undefined;
  const type = TYPES.includes(raw.type as PropertyType) ? (raw.type as PropertyType) : undefined;
  const sort = SORTS.includes(raw.sort as SortKey) ? (raw.sort as SortKey) : undefined;
  const verified = raw.verified === true || raw.verified === "true" ? true : undefined;
  const out: ListingSearch = {
    purpose,
    province: str(raw.province),
    city: str(raw.city),
    area: str(raw.area),
    type,
    minPrice: num(raw.minPrice),
    maxPrice: num(raw.maxPrice),
    beds: num(raw.beds),
    baths: num(raw.baths),
    minSize: num(raw.minSize),
    verified,
    agent: str(raw.agent),
    q: str(raw.q),
    sort,
  };
  // Drop undefined keys so URLs stay clean.
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined)) as ListingSearch;
}

export function filterProperties(list: Property[], s: ListingSearch): Property[] {
  const q = s.q?.toLowerCase();
  return list.filter((p) => {
    if (s.purpose && p.purpose !== s.purpose) return false;
    if (s.province && p.provinceSlug !== s.province) return false;
    if (s.city && p.citySlug !== s.city) return false;
    if (s.area && p.area !== s.area) return false;
    if (s.type && p.type !== s.type) return false;
    if (s.minPrice !== undefined && p.price < s.minPrice) return false;
    if (s.maxPrice !== undefined && p.price > s.maxPrice) return false;
    if (s.beds !== undefined && p.beds < s.beds) return false;
    if (s.baths !== undefined && p.baths < s.baths) return false;
    if (s.minSize !== undefined && toMarla(p.size.value, p.size.unit) < s.minSize) return false;
    if (s.verified && !p.verified) return false;
    if (s.agent && p.agentId !== s.agent) return false;
    if (q) {
      const hay = [p.title, p.area, p.society, p.block, p.address, p.citySlug].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortProperties(list: Property[], sort: SortKey = "newest"): Property[] {
  const copy = [...list];
  if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
  return copy.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
}

export interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

export const BUY_PRICE_RANGES: PriceRange[] = [
  { label: "Up to 50 Lakh", max: 5_000_000 },
  { label: "50 Lakh – 1 Crore", min: 5_000_000, max: 10_000_000 },
  { label: "1 – 3 Crore", min: 10_000_000, max: 30_000_000 },
  { label: "3 – 5 Crore", min: 30_000_000, max: 50_000_000 },
  { label: "5 – 10 Crore", min: 50_000_000, max: 100_000_000 },
  { label: "10 Crore+", min: 100_000_000 },
];

export const RENT_PRICE_RANGES: PriceRange[] = [
  { label: "Up to 50,000/month", max: 50_000 },
  { label: "50,000 – 1 Lakh/month", min: 50_000, max: 100_000 },
  { label: "1 – 3 Lakh/month", min: 100_000, max: 300_000 },
  { label: "3 Lakh+/month", min: 300_000 },
];

/** Applies a filter change and drops cleared (undefined) keys. */
export function mergeSearch(prev: ListingSearch, patch: Partial<ListingSearch>): ListingSearch {
  const next = { ...prev, ...patch } as Record<string, unknown>;
  for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k];
  return next as ListingSearch;
}

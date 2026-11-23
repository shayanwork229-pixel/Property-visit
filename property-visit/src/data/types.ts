export type Purpose = "buy" | "rent";

export type PropertyType =
  | "house"
  | "apartment"
  | "plot"
  | "commercial"
  | "shop"
  | "office"
  | "farmhouse"
  | "warehouse";

export type AreaUnit = "Marla" | "Kanal" | "Sq Ft";

export interface Property {
  id: string;
  slug: string;
  title: string;
  purpose: Purpose;
  type: PropertyType;
  /** Sale price in PKR, or monthly rent in PKR when purpose is "rent". */
  price: number;
  provinceSlug: string;
  citySlug: string;
  area: string;
  society: string;
  block: string;
  address: string;
  beds: number;
  baths: number;
  size: { value: number; unit: AreaUnit };
  images: string[];
  verified: boolean;
  featured: boolean;
  listedAt: string; // ISO date
  description: string;
  amenities: string[];
  agentId: string;
  coords: { lat: number; lng: number };
  status: "Available" | "Under Offer";
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  citySlug: string;
  phone: string; // E.164 without +
  email: string;
  rating: number;
  reviews: number;
  yearsExperience: number;
  specialties: string[];
}

export interface Project {
  slug: string;
  name: string;
  developer: string;
  citySlug: string;
  area: string;
  image: string;
  startingPrice: number;
  types: string[];
  completion: string;
  status: "Launching" | "Under Construction" | "Ready to Move";
  summary: string;
}

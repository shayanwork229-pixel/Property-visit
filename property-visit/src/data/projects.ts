import type { Project } from "./types";
import apartmentTower from "@/assets/apartment-tower.jpg";
import heroVilla from "@/assets/hero-villa.jpg";
import office from "@/assets/office.jpg";
import farmhouse from "@/assets/farmhouse.jpg";

// Sample developments shown until projects move to the database.
export const PROJECTS: Project[] = [
  {
    slug: "clifton-skyline-residences",
    name: "Clifton Skyline Residences",
    developer: "Seaside Developers",
    citySlug: "karachi",
    area: "Clifton",
    image: apartmentTower,
    startingPrice: 32_000_000,
    types: ["2 Bed", "3 Bed", "Penthouse"],
    completion: "Dec 2028",
    status: "Under Construction",
    summary: "A 24-storey sea-facing residential tower with infinity pool, gym and sky lounge.",
  },
  {
    slug: "dha-emerald-villas",
    name: "Emerald Villas",
    developer: "Emerald Builders",
    citySlug: "lahore",
    area: "DHA Defence",
    image: heroVilla,
    startingPrice: 68_000_000,
    types: ["10 Marla Villa", "1 Kanal Villa"],
    completion: "Ready",
    status: "Ready to Move",
    summary: "Gated collection of 40 modern villas with landscaped parks and a private clubhouse.",
  },
  {
    slug: "margalla-business-centre",
    name: "Margalla Business Centre",
    developer: "Capital Square Group",
    citySlug: "islamabad",
    area: "Blue Area",
    image: office,
    startingPrice: 18_500_000,
    types: ["Office", "Retail Shop"],
    completion: "Jun 2027",
    status: "Under Construction",
    summary: "Grade-A offices and ground-floor retail on Jinnah Avenue with Margalla views.",
  },
  {
    slug: "green-valley-farmhouses",
    name: "Green Valley Farmhouses",
    developer: "Valley Estates",
    citySlug: "islamabad",
    area: "Park Road",
    image: farmhouse,
    startingPrice: 45_000_000,
    types: ["2 Kanal", "4 Kanal", "8 Kanal"],
    completion: "Mar 2027",
    status: "Launching",
    summary: "Gated farmhouse community with orchards, walking trails and 24/7 security near Islamabad.",
  },
];

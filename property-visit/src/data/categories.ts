import type { PropertyType } from "./types";
import houseImg from "@/assets/house-1.jpg";
import apartmentImg from "@/assets/apartment-tower.jpg";
import plotImg from "@/assets/plot.jpg";
import commercialImg from "@/assets/commercial.jpg";
import shopImg from "@/assets/shop.jpg";
import officeImg from "@/assets/office.jpg";
import farmhouseImg from "@/assets/farmhouse.jpg";
import warehouseImg from "@/assets/warehouse.jpg";

export interface Category {
  type: PropertyType;
  label: string;
  plural: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { type: "house", label: "House", plural: "Houses", image: houseImg },
  { type: "apartment", label: "Apartment", plural: "Apartments & Flats", image: apartmentImg },
  { type: "plot", label: "Plot", plural: "Plots", image: plotImg },
  { type: "commercial", label: "Commercial", plural: "Commercial Properties", image: commercialImg },
  { type: "shop", label: "Shop", plural: "Shops", image: shopImg },
  { type: "office", label: "Office", plural: "Offices", image: officeImg },
  { type: "farmhouse", label: "Farmhouse", plural: "Farmhouses", image: farmhouseImg },
  { type: "warehouse", label: "Warehouse", plural: "Warehouses", image: warehouseImg },
];

export function categoryLabel(type: PropertyType) {
  return CATEGORIES.find((c) => c.type === type)?.label ?? type;
}

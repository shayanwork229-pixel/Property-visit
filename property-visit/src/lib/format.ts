import type { AreaUnit, Purpose } from "@/data/types";

const CRORE = 10_000_000;
const LAKH = 100_000;

function trim(n: number) {
  return Number(n.toFixed(2)).toString();
}

/** Formats a PKR amount the way Pakistanis read it: Crore, Lakh, then thousands. */
export function formatPKR(amount: number, purpose?: Purpose) {
  let text: string;
  if (amount >= CRORE) text = `PKR ${trim(amount / CRORE)} Crore`;
  else if (amount >= LAKH) text = `PKR ${trim(amount / LAKH)} Lakh`;
  else text = `PKR ${amount.toLocaleString("en-PK")}`;
  return purpose === "rent" ? `${text}/month` : text;
}

export function formatPKRFull(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** Standard Pakistani portal conversion: 1 Marla = 225 sq ft, 1 Kanal = 20 Marla. */
export const SQFT_PER_MARLA = 225;
export const MARLA_PER_KANAL = 20;

export function toSqft(value: number, unit: AreaUnit) {
  if (unit === "Marla") return value * SQFT_PER_MARLA;
  if (unit === "Kanal") return value * MARLA_PER_KANAL * SQFT_PER_MARLA;
  return value;
}

export function toMarla(value: number, unit: AreaUnit) {
  return toSqft(value, unit) / SQFT_PER_MARLA;
}

export function formatSize(value: number, unit: AreaUnit) {
  return `${value.toLocaleString("en-PK")} ${unit}`;
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

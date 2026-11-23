import { useSyncExternalStore } from "react";

// Browser-local favourites and comparison list. Moves to the user's account in Phase 5.
export const MAX_COMPARE = 3;

type Key = "pv-favorites" | "pv-compare";
const EMPTY: string[] = [];
const cache = new Map<Key, string[]>();
const listeners = new Set<() => void>();

function read(key: Key): string[] {
  if (typeof window === "undefined") return EMPTY;
  const cached = cache.get(key);
  if (cached) return cached;
  let value: string[] = EMPTY;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (Array.isArray(parsed)) value = parsed.filter((x) => typeof x === "string");
  } catch {
    value = EMPTY;
  }
  cache.set(key, value);
  return value;
}

function write(key: Key, value: string[]) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: keep in-memory value */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "pv-favorites" || e.key === "pv-compare") {
      cache.delete(e.key);
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function useList(key: Key) {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  );
}

export function useFavorites() {
  const ids = useList("pv-favorites");
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => {
      const cur = read("pv-favorites");
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      write("pv-favorites", next);
      return next.includes(id);
    },
  };
}

export type CompareResult = "added" | "removed" | "full";

/** Pure rule: a comparison holds at most MAX_COMPARE properties. */
export function toggleCompareList(current: string[], id: string): { next: string[]; result: CompareResult } {
  if (current.includes(id)) return { next: current.filter((x) => x !== id), result: "removed" };
  if (current.length >= MAX_COMPARE) return { next: current, result: "full" };
  return { next: [...current, id], result: "added" };
}

export function useCompare() {
  const ids = useList("pv-compare");
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string): CompareResult => {
      const { next, result } = toggleCompareList(read("pv-compare"), id);
      if (result !== "full") write("pv-compare", next);
      return result;
    },
    clear: () => write("pv-compare", []),
  };
}

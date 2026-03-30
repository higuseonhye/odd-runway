import { useCallback, useEffect, useState } from "react";
import type { PressureFlag } from "../lib/situationInference";

const STORAGE_KEY = "odd-runway-pressure-v1";

const ALL_FLAGS: PressureFlag[] = [
  "liquidity_clock",
  "stakeholder_pressure",
  "execution_risk",
];

function parseStored(raw: string | null): Set<PressureFlag> {
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is PressureFlag => ALL_FLAGS.includes(x)));
  } catch {
    return new Set();
  }
}

export function usePressureFlags() {
  const [flags, setFlags] = useState<Set<PressureFlag>>(() => {
    if (typeof window === "undefined") return new Set();
    return parseStored(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    setFlags(parseStored(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const toggle = useCallback((f: PressureFlag) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { flags, toggle };
}

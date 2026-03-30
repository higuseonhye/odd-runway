import type { RunwayState } from "../types/runway";

const KEY = "odd-runway/v1";

export function loadRunwayState(fallback: RunwayState): RunwayState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<RunwayState>;
    return {
      cashOnHand: typeof p.cashOnHand === "number" ? p.cashOnHand : fallback.cashOnHand,
      monthlyBurn: typeof p.monthlyBurn === "number" ? p.monthlyBurn : fallback.monthlyBurn,
      monthlyRevenue:
        typeof p.monthlyRevenue === "number" ? p.monthlyRevenue : fallback.monthlyRevenue,
      momGrowthPct: typeof p.momGrowthPct === "number" ? p.momGrowthPct : fallback.momGrowthPct,
    };
  } catch {
    return fallback;
  }
}

export function saveRunwayState(state: RunwayState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

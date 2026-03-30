import type { RunwayState } from "../types/runway";

/** USD assumptions; no persistence — client-side model only. */

export function formatUsd(n: number, compact = false): string {
  if (!Number.isFinite(n)) return "—";
  if (compact && Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(1)}k`;
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function netBurn(monthlyBurn: number, monthlyRevenue: number): number {
  return Math.max(0, monthlyBurn - monthlyRevenue);
}

/** Net cash burn plus required debt service (liquidity leaving the company each month). */
export function effectiveNetBurn(
  monthlyBurn: number,
  monthlyRevenue: number,
  monthlyDebtService: number
): number {
  return netBurn(monthlyBurn, monthlyRevenue) + Math.max(0, monthlyDebtService);
}

/** Cash + conservative share of AR (not GAAP — planning lens only). */
export function adjustedLiquidCash(
  cashOnHand: number,
  accountsReceivable: number,
  arCollectibilityPct: number
): number {
  const pct = Math.min(100, Math.max(0, arCollectibilityPct));
  return cashOnHand + (accountsReceivable * pct) / 100;
}

export function runwayMonths(cashOnHand: number, net: number): number | null {
  if (net <= 0) return null;
  return cashOnHand / net;
}

/** Runway using operating cash only (same net of revenue & debt service). */
export function runwayMonthsCashOnly(state: RunwayState): number | null {
  const nb = effectiveNetBurn(state.monthlyBurn, state.monthlyRevenue, state.monthlyDebtService);
  if (nb <= 0) return null;
  return state.cashOnHand / nb;
}

/** Runway using adjusted liquidity (cash + haircut AR). Primary headline for mode + crisis. */
export function runwayMonthsEffective(state: RunwayState): number | null {
  const nb = effectiveNetBurn(state.monthlyBurn, state.monthlyRevenue, state.monthlyDebtService);
  if (nb <= 0) return null;
  const liq = adjustedLiquidCash(
    state.cashOnHand,
    state.accountsReceivable,
    state.arCollectibilityPct
  );
  return liq / nb;
}

export type MonthProjection = { month: number; cashEnd: number; revenue: number; netBurn: number };

/**
 * Constant gross burn; revenue compounds MoM from current monthly revenue.
 */
export function projectCash(
  cashOnHand: number,
  monthlyBurn: number,
  monthlyRevenue: number,
  momGrowthPct: number,
  months: number,
  monthlyDebtService = 0
): MonthProjection[] {
  const g = momGrowthPct / 100;
  const debt = Math.max(0, monthlyDebtService);
  const out: MonthProjection[] = [];
  let cash = cashOnHand;
  for (let m = 1; m <= months; m++) {
    const revenue = monthlyRevenue * Math.pow(1 + g, m - 1);
    const nb = Math.max(0, monthlyBurn - revenue) + debt;
    cash -= nb;
    out.push({ month: m, cashEnd: cash, revenue, netBurn: nb });
  }
  return out;
}

export function breakevenRevenue(monthlyBurn: number, monthlyDebtService = 0): number {
  return monthlyBurn + Math.max(0, monthlyDebtService);
}

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

export function runwayMonths(cashOnHand: number, net: number): number | null {
  if (net <= 0) return null;
  return cashOnHand / net;
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
  months: number
): MonthProjection[] {
  const g = momGrowthPct / 100;
  const out: MonthProjection[] = [];
  let cash = cashOnHand;
  for (let m = 1; m <= months; m++) {
    const revenue = monthlyRevenue * Math.pow(1 + g, m - 1);
    const nb = Math.max(0, monthlyBurn - revenue);
    cash -= nb;
    out.push({ month: m, cashEnd: cash, revenue, netBurn: nb });
  }
  return out;
}

export function breakevenRevenue(monthlyBurn: number): number {
  return monthlyBurn;
}

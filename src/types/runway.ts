export type RunwayState = {
  cashOnHand: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  momGrowthPct: number;
  /** Accounts receivable / near-term collectible revenue (USD) — not cash until collected */
  accountsReceivable: number;
  /** Monthly debt service (principal + interest on short-term debt, LOC, etc.) */
  monthlyDebtService: number;
  /** 0–100: conservative % of AR you expect to convert to cash soon */
  arCollectibilityPct: number;
};

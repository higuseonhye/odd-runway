import type { RunwayState } from "../types/runway";

export type ScenarioPreset = RunwayState & {
  id: string;
  label: string;
};

export function scenarioToRunwayState(s: ScenarioPreset): RunwayState {
  return {
    cashOnHand: s.cashOnHand,
    monthlyBurn: s.monthlyBurn,
    monthlyRevenue: s.monthlyRevenue,
    momGrowthPct: s.momGrowthPct,
    accountsReceivable: s.accountsReceivable,
    monthlyDebtService: s.monthlyDebtService,
    arCollectibilityPct: s.arCollectibilityPct,
  };
}

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "seed",
    label: "Seed",
    cashOnHand: 1_200_000,
    monthlyBurn: 95_000,
    monthlyRevenue: 12_000,
    momGrowthPct: 7,
    accountsReceivable: 45_000,
    monthlyDebtService: 0,
    arCollectibilityPct: 55,
  },
  {
    id: "series-a",
    label: "Series A",
    cashOnHand: 6_000_000,
    monthlyBurn: 420_000,
    monthlyRevenue: 180_000,
    momGrowthPct: 8,
    accountsReceivable: 220_000,
    monthlyDebtService: 8_000,
    arCollectibilityPct: 65,
  },
  {
    id: "high-growth",
    label: "High growth",
    cashOnHand: 3_500_000,
    monthlyBurn: 520_000,
    monthlyRevenue: 310_000,
    momGrowthPct: 12,
    accountsReceivable: 180_000,
    monthlyDebtService: 12_000,
    arCollectibilityPct: 60,
  },
];

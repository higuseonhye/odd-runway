export type ScenarioPreset = {
  id: string;
  label: string;
  cashOnHand: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  momGrowthPct: number;
};

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "seed",
    label: "Seed",
    cashOnHand: 1_200_000,
    monthlyBurn: 95_000,
    monthlyRevenue: 12_000,
    momGrowthPct: 7,
  },
  {
    id: "series-a",
    label: "Series A",
    cashOnHand: 6_000_000,
    monthlyBurn: 420_000,
    monthlyRevenue: 180_000,
    momGrowthPct: 8,
  },
  {
    id: "high-growth",
    label: "High growth",
    cashOnHand: 3_500_000,
    monthlyBurn: 520_000,
    monthlyRevenue: 310_000,
    momGrowthPct: 12,
  },
];

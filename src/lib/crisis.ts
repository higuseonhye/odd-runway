export type CrisisTier = "critical" | "warning" | "stable";

export function tierForRunwayMonths(months: number | null): CrisisTier {
  if (months === null) return "stable";
  if (months <= 3) return "critical";
  if (months <= 9) return "warning";
  return "stable";
}

export type CrisisContent = {
  title: string;
  actions: string[];
  insightHtml: string;
};

export function crisisCopy(runwayMonths: number | null): Record<CrisisTier, CrisisContent> {
  const m = runwayMonths ?? 0;
  const pctPerWeek =
    runwayMonths !== null && runwayMonths > 0
      ? (100 / Math.max(runwayMonths, 0.25)).toFixed(0)
      : "∞";

  return {
    critical: {
      title: "Critical — ship actions this week",
      actions: [
        "Freeze non-essential spend; rank cuts by dollar and effective date.",
        "Single-thread fundraising: target raise, close-by date, weekly outreach quota.",
        "Brief largest investors on bridge/extension with one-pager (runway, burn, milestone).",
        "B2B: accelerate collections; consumer: ethical prepay/annual where it fits.",
      ],
      insightHtml:
        runwayMonths !== null && runwayMonths <= 0
          ? "Runway is exhausted on paper — <strong>assume no new capital until proven</strong> and model survival on cuts and receivables only."
          : `At ~${m.toFixed(1)} mo, each week consumes ~${pctPerWeek}% of remaining runway. <strong>Parallel paths</strong> (cuts + pipeline) beat serial hope.`,
    },
    warning: {
      title: "Warning — change operating mode",
      actions: [
        "Set a decision date: when must a term sheet land before you execute Plan B burn?",
        "Refresh the model with hiring frozen by default.",
        "Ship a tight monthly investor update — transparency buys optionality.",
        "Pick one revenue or cost lever that moves inside 30 days.",
      ],
      insightHtml:
        "Below ~12 months, US fundraising realistically overlaps your next operating plan. <strong>Start the clock</strong> on real conversations now.",
    },
    stable: {
      title: "Stable — protect optionality",
      actions: [
        "Aim for 18+ months runway (raise or cut burn before you feel forced).",
        "Keep investor updates consistent — surprise is what kills trust.",
        "Track Rule of 40 / burn multiple quarterly; fix trajectory early.",
      ],
      insightHtml:
        runwayMonths === null
          ? "At current inputs, net burn is ≤0 — still stress-test downside and keep a monthly investor rhythm."
          : `At ~${m.toFixed(1)} mo, stress-test −20% revenue and +15% burn — if runway stays &gt;12 mo, you keep room to execute.`,
    },
  };
}

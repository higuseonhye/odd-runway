import type { RunwayState } from "../types/runway";
import { effectiveNetBurn, runwayMonthsCashOnly, runwayMonthsEffective } from "./finance";

/** How the org should run — inferred from numbers only (no confessional onboarding). */
export type OperatingMode = "normal" | "tight" | "crisis" | "survival";

export type PressureFlag = "liquidity_clock" | "stakeholder_pressure" | "execution_risk";

export type InferredSituation = {
  mode: OperatingMode;
  /** Headline runway: adjusted liquidity ÷ effective net burn */
  runwayMonths: number | null;
  /** Same denominator, operating cash only (for comparison) */
  cashRunwayMonths: number | null;
  /** True if AR or debt service is modeled */
  hasLiquidityBeyondCash: boolean;
  /** Net burn + debt service */
  netBurn: number;
  /** One line — user never had to describe feelings */
  silentInsight: string;
  /** Extra line if pressure flags set */
  pressureAddendum: string | null;
};

function modeFromRunway(m: number | null): OperatingMode {
  if (m === null) return "normal";
  if (m <= 0) return "survival";
  if (m <= 1.5) return "survival";
  if (m <= 3) return "crisis";
  if (m <= 9) return "tight";
  if (m <= 12) return "tight";
  return "normal";
}

export function inferSituation(
  state: RunwayState,
  effectiveRunwayM: number | null,
  pressure: Set<PressureFlag>
): InferredSituation {
  const nb = effectiveNetBurn(state.monthlyBurn, state.monthlyRevenue, state.monthlyDebtService);
  const cashRw = runwayMonthsCashOnly(state);
  const hasLiquidityBeyondCash = state.accountsReceivable > 0 || state.monthlyDebtService > 0;

  let mode = modeFromRunway(effectiveRunwayM);

  if (
    effectiveRunwayM !== null &&
    effectiveRunwayM > 9 &&
    effectiveRunwayM <= 18 &&
    nb > state.monthlyRevenue * 0.5
  ) {
    mode = "tight";
  }

  const silentInsight = silentLine(
    mode,
    effectiveRunwayM,
    cashRw,
    nb,
    state,
    hasLiquidityBeyondCash
  );
  const pressureAddendum = pressureAddendumFor(pressure, mode);

  return {
    mode,
    runwayMonths: effectiveRunwayM,
    cashRunwayMonths: cashRw,
    hasLiquidityBeyondCash,
    netBurn: nb,
    silentInsight,
    pressureAddendum,
  };
}

function silentLine(
  mode: OperatingMode,
  runwayM: number | null,
  cashRw: number | null,
  netBurnVal: number,
  state: RunwayState,
  hasLiquidityBeyondCash: boolean
): string {
  const cashZeroish =
    cashRw !== null && cashRw <= 0.25 && netBurnVal > 0;

  if (cashZeroish && runwayM !== null && runwayM > 0.5 && hasLiquidityBeyondCash) {
    return "Operating cash is nearly gone on this model, but receivables or other modeled liquidity still buy time — collections and terms are now the P0, not the deck.";
  }

  if (
    (runwayM !== null && runwayM <= 0.5 && netBurnVal > 0) ||
    (cashRw !== null && cashRw <= 0 && runwayM !== null && runwayM <= 0)
  ) {
    return "At these inputs, runway on the headline model is effectively gone — the next choices are non-financial-accounting: payroll law, contracts, personal exposure, and orderly wind-down or bridge. See Playbooks → worst case; this app does not provide legal advice.";
  }

  if (mode === "survival") {
    return "Your inputs imply cash timing is the constraint — triage beats narrative. You do not owe this app a story; you owe the next seven days a plan.";
  }
  if (mode === "crisis") {
    return "The math points to a crisis band — parallel levers (spend, capital, collections, debt service) beat serial hope. Many founders in this band benefit from one trusted peer or advisor in the loop, not solo heroics.";
  }
  if (mode === "tight") {
    return "Runway and fundraising clocks overlap in the US — optionality fades faster than it feels. Starting real conversations early is the healthy default.";
  }
  if (runwayM === null || netBurnVal <= 0) {
    return "At these inputs, cash-out is not the immediate bind — still stress-test downside, debt service, and AR quality; keep investor rhythm boringly consistent.";
  }

  const liqNote = hasLiquidityBeyondCash
    ? " Headline uses adjusted liquidity (cash + conservative AR) and includes debt service in burn."
    : "";

  return `Roughly ${runwayM!.toFixed(1)} months of headline runway at effective net burn — protect 18+ months when you can; stress-test revenue miss, AR collection, and burn creep quarterly.${liqNote}`;
}

function pressureAddendumFor(pressure: Set<PressureFlag>, mode: OperatingMode): string | null {
  if (pressure.size === 0) return null;
  const parts: string[] = [];
  if (pressure.has("liquidity_clock")) {
    parts.push("Liquidity timing is salient — shorten decision horizons and document assumptions weekly.");
  }
  if (pressure.has("stakeholder_pressure")) {
    parts.push("Stakeholder pressure often grows when updates stop — a short, honest cadence usually beats a perfect deck.");
  }
  if (pressure.has("execution_risk")) {
    parts.push("Execution risk rises when the team is guessing — one-page truth on cash and runway reduces thrash.");
  }
  if (mode === "survival" || mode === "crisis") {
    parts.push(
      "If you are stuck in a worry loop, set a short timer for cash triage — then act on the next lever (collect, cut, or raise), not the spiral."
    );
  }
  return parts.join(" ");
}

export function computeRunwayForInference(state: RunwayState): number | null {
  return runwayMonthsEffective(state);
}

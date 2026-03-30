import type { RunwayState } from "../types/runway";
import { netBurn, runwayMonths } from "./finance";

/** How the org should run — inferred from numbers only (no confessional onboarding). */
export type OperatingMode = "normal" | "tight" | "crisis" | "survival";

export type PressureFlag = "liquidity_clock" | "stakeholder_pressure" | "execution_risk";

export type InferredSituation = {
  mode: OperatingMode;
  runwayMonths: number | null;
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
  runwayM: number | null,
  pressure: Set<PressureFlag>
): InferredSituation {
  const nb = netBurn(state.monthlyBurn, state.monthlyRevenue);
  let mode = modeFromRunway(runwayM);

  if (runwayM !== null && runwayM > 9 && runwayM <= 18 && nb > state.monthlyRevenue * 0.5) {
    mode = "tight";
  }

  const silentInsight = silentLine(mode, runwayM, nb, state);
  const pressureAddendum = pressureAddendumFor(pressure, mode);

  return {
    mode,
    runwayMonths: runwayM,
    netBurn: nb,
    silentInsight,
    pressureAddendum,
  };
}

function silentLine(
  mode: OperatingMode,
  runwayM: number | null,
  netBurn: number,
  state: RunwayState
): string {
  if (mode === "survival") {
    return "Your inputs imply cash timing is the constraint — triage beats narrative. You do not owe this app a story; you owe the next seven days a plan.";
  }
  if (mode === "crisis") {
    return "The math points to a crisis band — parallel levers (spend, capital, collections) beat serial hope. Many founders in this band benefit from one trusted peer or advisor in the loop, not solo heroics.";
  }
  if (mode === "tight") {
    return "Runway and fundraising clocks overlap in the US — optionality fades faster than it feels. Starting real conversations early is the healthy default.";
  }
  if (runwayM === null || netBurn <= 0) {
    return "At these inputs, cash-out is not the immediate bind — still stress-test downside and keep investor rhythm boringly consistent.";
  }
  return `Roughly ${runwayM!.toFixed(1)} months of runway at current net burn — protect 18+ months when you can; stress-test revenue miss and burn creep quarterly.`;
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
  const nb = netBurn(state.monthlyBurn, state.monthlyRevenue);
  return runwayMonths(state.cashOnHand, nb);
}

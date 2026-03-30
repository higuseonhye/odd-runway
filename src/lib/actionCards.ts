import type { RunwayState } from "../types/runway";
import { runwayMonthsCashOnly, runwayMonthsEffective } from "./finance";
import type { InferredSituation } from "./situationInference";

export type ActionCardCategory = "research" | "people" | "capital" | "ops";

export type ActionCard = {
  id: string;
  category: ActionCardCategory;
  title: string;
  subtitle: string;
  /** Ready = navigates in-app; roadmap = future agents / integrations */
  status: "ready" | "roadmap";
  /** Hash for in-app navigation (tab + optional scroll target) */
  href?:
    | "#overview"
    | "#runway"
    | "#playbooks"
    | "#tools"
    | "#investor-email"
    | "#deadlines"
    | "#worst-extreme-liquidity";
};

const CAT_LABEL: Record<ActionCardCategory, string> = {
  research: "Research",
  people: "People",
  capital: "Capital",
  ops: "Ops",
};

export function categoryLabel(c: ActionCardCategory): string {
  return CAT_LABEL[c];
}

export function buildActionCards(inferred: InferredSituation, state: RunwayState): ActionCard[] {
  const { mode, runwayMonths } = inferred;
  const eff = runwayMonthsEffective(state);
  const cashR = runwayMonthsCashOnly(state);
  const short =
    runwayMonths !== null && runwayMonths <= 6
      ? "Runway is thin — prioritize cash levers you can ship this week."
      : "Optionality is easier to protect before the clock gets loud.";

  const cards: ActionCard[] = [];

  if (
    (eff !== null && eff <= 1.25) ||
    (cashR !== null && cashR <= 0.5 && eff !== null && eff < 6)
  ) {
    cards.push({
      id: "extreme-liquidity",
      category: "ops",
      title: "Worst case: liquidity exhausted on the model",
      subtitle: "Open Playbooks — when cash & AR are gone, there are still branches (wind-down, sale, counsel). Not legal advice.",
      status: "ready",
      href: "#worst-extreme-liquidity",
    });
  }

  cards.push(
    {
      id: "full-model",
      category: "research",
      title: "Stress-test revenue & burn",
      subtitle: "Open the full model with growth, import, and 12‑month chart.",
      status: "ready",
      href: "#runway",
    },
    {
      id: "draft-update",
      category: "capital",
      title: "Draft investor update",
      subtitle: "Build HTML from today’s numbers, wins, and asks.",
      status: "ready",
      href: "#investor-email",
    },
    {
      id: "playbooks",
      category: "ops",
      title: "Crisis & resilience playbooks",
      subtitle: short,
      status: "ready",
      href: "#playbooks",
    },
    {
      id: "agent-research",
      category: "research",
      title: "Agent: surface benchmarks & checklists",
      subtitle: "Auto-pull US fundraising norms, SAFE/convertible notes, and board hygiene — on the roadmap.",
      status: "roadmap",
    },
    {
      id: "agent-people",
      category: "people",
      title: "Agent: match a fractional CFO or peer",
      subtitle: "Warm intros from your mode and sector — not automated advice; humans in the loop — roadmap.",
      status: "roadmap",
    },
    {
      id: "agent-capital",
      category: "capital",
      title: "Agent: shortlist bridge & extension paths",
      subtitle: "Scenario cards from your runway band — diligence still yours — roadmap.",
      status: "roadmap",
    }
  );

  if (mode === "crisis" || mode === "survival") {
    cards.unshift({
      id: "collections-first",
      category: "ops",
      title: "Collections & terms pass",
      subtitle: "Largest customers and vendors first — same playbook lives under Playbooks.",
      status: "ready",
      href: "#playbooks",
    });
  }

  return cards;
}

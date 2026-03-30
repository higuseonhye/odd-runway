import type { OperatingMode } from "./situationInference";

export const MODE_LABEL: Record<OperatingMode, { label: string }> = {
  normal: { label: "Normal" },
  tight: { label: "Tight" },
  crisis: { label: "Crisis" },
  survival: { label: "Survival" },
};

export type ResilienceSection = {
  id: string;
  title: string;
  body: string[];
};

/** Ways through without needing to justify your situation out loud. */
export const HEALTHY_THROUGH: ResilienceSection[] = [
  {
    id: "alone",
    title: "You do not have to grind this alone",
    body: [
      "One peer founder, one advisor, or one fractional CFO on a short call can unblock a concrete decision — faster than weeks of solo rumination.",
      "Silence rarely pays down runway. A short factual update often moves the situation forward; the point is clarity and forward motion, not performance — survival as a company is not guaranteed.",
      "This app is for cash and runway math — not medical care or emergency services. If you are in immediate danger, use local emergency resources.",
    ],
  },
  {
    id: "body",
    title: "Sustainable pace is a strategy, not a luxury",
    body: [
      "Sleep and exercise are not rewards for after the crisis — they are inputs to decision quality under stress.",
      "Batch decisions: one calendar block for “money panic” so the rest of the week is for building.",
    ],
  },
  {
    id: "truth",
    title: "One-page truth beats a perfect story",
    body: [
      "Cash, burn, runway, next milestone, top risk — on a single page shared with your inner circle reduces thrash.",
      "When numbers are tight, ambiguity is expensive. Clarity is kind.",
    ],
  },
];

/** When exhaustion feels like finality — options may still exist, or the branch may be an ending; both deserve clarity. */
export const WHEN_STUCK_FEELS_FINAL: ResilienceSection[] = [
  {
    id: "nothing_left",
    title: "“Is this the end?” — when you think there is nothing left to do",
    body: [
      "That feeling is common when runway and energy are both thin. It is not a perfect map of reality: sometimes levers still exist but are hard to see (collections, vendor terms, scope cuts, a direct stakeholder conversation, or a small bridge).",
      "Sometimes the company really is at a terminal branch — and that is still a kind of option, not a void: orderly wind-down, sale, or honest reset. Clarity includes naming that branch, not only a “hero save.”",
      "“Is this the end?” and “have I listed every lever I can stand to pull?” are different questions. This app only helps sharpen the second, in the narrow sense of cash and runway — not your whole story.",
    ],
  },
];

/** When things are already bad — execution first; legal/tax review so fixes don’t create new liabilities. */
export const WORST_CASE_HORIZON: ResilienceSection[] = [
  {
    id: "counsel",
    title: "Address the situation — then get the paperwork right",
    body: [
      "The outcome you may need is often more cash, more time, or an orderly wind-down — not a conversation. Bridge terms, debt, restructuring, layoffs, wind-down, and M&A still have legal, tax, and fiduciary edges: this app does not provide legal or tax advice; a qualified attorney and CPA in your jurisdiction help you execute without stepping on landmines.",
      "Boards and material contracts may require specific notices — align legal review with your operating plan when runway is in weeks, not the day before payroll fails.",
    ],
  },
  {
    id: "orderly",
    title: "Orderly paths preserve optionality",
    body: [
      "An orderly reduction in burn (dates, names, dollars) often preserves more stakeholder trust than death by a thousand cuts.",
      "If the company might not survive, early transparency with key investors can sometimes unlock bridge or acquisition conversations — execute the outreach; use legal review where contracts or securities law require it.",
    ],
  },
];

/** Convention-breaking only in the sense of “what experienced operators sometimes do” — still ethics- and law-bound. */
export const BREAK_CONVENTION: ResilienceSection[] = [
  {
    id: "bridge",
    title: "When “wait for the perfect round” is the risky move",
    body: [
      "Insider bridges, extension rounds, or structured secondaries are established patterns — not shameful, just negotiated. Terms matter more than optics.",
      "Trading valuation for time is sometimes rational — document the trade explicitly.",
    ],
  },
  {
    id: "scope",
    title: "Narrow scope to survive",
    body: [
      "Pausing geography, SKU, or hiring plans to protect core customers is often the unconventional move that preserves the company.",
      "Saying no to noisy opportunities is a financial strategy when runway is the constraint.",
    ],
  },
  {
    id: "narrative",
    title: "Break the “always crushing it” script",
    body: [
      "Investors in the US often respect disciplined downside planning more than cheerleading. Boring updates that include risks and mitigations build trust.",
      "You can lead with facts without performing distress — that balance is learnable.",
    ],
  },
];

/** When even headline liquidity is gone — choices still exist (not legal advice). */
export const WORST_EXTREME_LIQUIDITY: ResilienceSection[] = [
  {
    id: "no_cash_no_cards",
    title: "When operating cash and modeled AR are gone — choices still exist",
    body: [
      "Payroll, WARN, final wages, and contractor status are jurisdiction-specific — get counsel before you act; wrong moves create personal liability.",
      "Orderly wind-down: board / investor consent where required, customer and data handling, vendor settlement, cap table — can be a deliberate branch, not only chaos.",
      "Last-resort liquidity (personal bridge, friends & family, SBA or asset-backed small-business credit, 401(k) / rollover) carries tax and relationship cost — model with a CPA, not a tweet.",
      "Low-price sale, acquihire, or IP/asset sale — sometimes preserves jobs or customers; structure with counsel.",
      "Bankruptcy tools (e.g. Ch. 7 / Ch. 11 in the US) and state insolvency paths — for a clean stop or reorganization — only with qualified counsel.",
    ],
  },
];

/** After a wind-down, sale, or stop — the spreadsheet ends; life and loose ends do not. */
export const AFTER_IT_ENDS: ResilienceSection[] = [
  {
    id: "after",
    title: "After it ends",
    body: [
      "A company stopping is not the same as you stopping. There is still execution: final payroll, filings, vendor close, cap table — and a calendar that keeps going after the last signature.",
      "The months after are often uneven: cash, identity, and reputation do not recover on the same schedule. A smaller next project, a job, consulting, or a long pause can all be valid — not a downgrade, only a path.",
      "This app does not model that arc; runway math stops here. What you do with the time after is outside these numbers — and still real.",
    ],
  },
];

export function modePlaybook(mode: OperatingMode): string[] {
  switch (mode) {
    case "survival":
      return [
        "Assume zero new capital until a wire clears — plan from cash in bank.",
        "One owner for cash decisions; no unfunded commitments.",
        "Same-day outreach: largest customers (collections), largest investors (bridge), largest vendors (terms).",
      ];
    case "crisis":
      return [
        "Parallel workstreams: cut plan with dates, fundraising pipeline with weekly targets, collections.",
        "Decision date on calendar: term sheet or execute Plan B burn.",
      ];
    case "tight":
      return [
        "Fundraising is a parallel project, not a future project — block calendar time weekly.",
        "Freeze hiring by default; every new hire needs a written ROI case.",
      ];
    default:
      return [
        "Build 18+ months runway when the market allows — optionality is an asset.",
        "Run quarterly downside scenarios before you need them.",
      ];
  }
}

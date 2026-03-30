export type DeadlineRow = {
  action: string;
  cadence: string;
  why: string;
};

export const RUNWAY_DEADLINES: DeadlineRow[] = [
  {
    action: "Investor update (burn, runway, wins, asks)",
    cadence: "Monthly",
    why: "Trust + optionality for insider or bridge rounds.",
  },
  {
    action: "Cash & runway reconciliation",
    cadence: "Monthly",
    why: "Catch drift before it becomes a crisis.",
  },
  {
    action: "Hiring & vendor spend review",
    cadence: "Monthly",
    why: "Burn is a series of decisions, not one number.",
  },
  {
    action: "Fundraising pipeline review",
    cadence: "Biweekly if runway < 12 mo",
    why: "US processes often take 6+ months to close.",
  },
  {
    action: "Board / lead investor sync",
    cadence: "Quarterly",
    why: "Align early on runway and scenario plans.",
  },
  {
    action: "Scenario model (base / cut / grow)",
    cadence: "Quarterly",
    why: "Know your levers before you need them.",
  },
];

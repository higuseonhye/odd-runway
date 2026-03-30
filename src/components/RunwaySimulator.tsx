import { useMemo } from "react";
import {
  breakevenRevenue,
  formatUsd,
  netBurn,
  projectCash,
  runwayMonths,
} from "../lib/finance";
import type { CsvModelSuggestion } from "../lib/csvFinance";
import { SCENARIOS } from "../lib/scenarios";
import type { RunwayState } from "../types/runway";
import { CashChart } from "./CashChart";
import { CsvImportPanel } from "./CsvImportPanel";

type Props = {
  cashOnHand: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  momGrowthPct: number;
  onCashChange: (v: number) => void;
  onBurnChange: (v: number) => void;
  onRevenueChange: (v: number) => void;
  onMomChange: (v: number) => void;
  onApplyPreset: (state: RunwayState) => void;
  onApplyCsv: (s: CsvModelSuggestion) => void;
};

function SliderRow(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (v: number) => void;
}) {
  const { label, value, min, max, step, format, onChange } = props;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label className="text-sm text-muted">{label}</label>
        <span className="font-mono text-sm text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
      />
    </div>
  );
}

export function RunwaySimulator({
  cashOnHand,
  monthlyBurn,
  monthlyRevenue,
  momGrowthPct,
  onCashChange,
  onBurnChange,
  onRevenueChange,
  onMomChange,
  onApplyPreset,
  onApplyCsv,
}: Props) {
  const nb = netBurn(monthlyBurn, monthlyRevenue);
  const rw = runwayMonths(cashOnHand, nb);
  const series = useMemo(
    () => projectCash(cashOnHand, monthlyBurn, monthlyRevenue, momGrowthPct, 12),
    [cashOnHand, monthlyBurn, monthlyRevenue, momGrowthPct]
  );

  const be = breakevenRevenue(monthlyBurn);

  return (
    <section id="simulator" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Runway model
        </h2>
        <p className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-ink">
          USD — import a CSV to auto-fill, then fine-tune with sliders. Saved in this browser;
          optional Supabase sync (free tier).
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                onApplyPreset({
                  cashOnHand: s.cashOnHand,
                  monthlyBurn: s.monthlyBurn,
                  monthlyRevenue: s.monthlyRevenue,
                  momGrowthPct: s.momGrowthPct,
                })
              }
              className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs font-medium text-muted transition hover:border-accent/50 hover:text-ink"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <CsvImportPanel onApply={onApplyCsv} />
        </div>

        <div className="mt-8 grid gap-8 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <SliderRow
              label="Cash on hand"
              value={cashOnHand}
              min={150_000}
              max={12_000_000}
              step={25_000}
              format={(n) => formatUsd(n, true)}
              onChange={onCashChange}
            />
            <SliderRow
              label="Monthly gross burn"
              value={monthlyBurn}
              min={40_000}
              max={900_000}
              step={5_000}
              format={(n) => formatUsd(n, true)}
              onChange={onBurnChange}
            />
            <SliderRow
              label="Monthly revenue (MRR-style)"
              value={monthlyRevenue}
              min={0}
              max={Math.max(800_000, monthlyBurn)}
              step={5_000}
              format={(n) => formatUsd(n, true)}
              onChange={onRevenueChange}
            />
            <SliderRow
              label="Revenue MoM growth %"
              value={momGrowthPct}
              min={-8}
              max={22}
              step={0.5}
              format={(n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`}
              onChange={onMomChange}
            />
          </div>

          <div className="rounded-xl border border-line bg-canvas/80 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Net burn / month</dt>
                <dd className="font-mono text-ink">{formatUsd(nb, true)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Runway</dt>
                <dd className="font-mono font-semibold text-accent">
                  {rw === null ? "∞ (net burn ≤ 0)" : `${rw.toFixed(1)} mo`}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Rough breakeven revenue</dt>
                <dd className="font-mono text-ink">{formatUsd(be, true)} / mo</dd>
              </div>
            </dl>
            <CashChart series={series} initialCash={cashOnHand} />
          </div>
        </div>
      </div>
    </section>
  );
}

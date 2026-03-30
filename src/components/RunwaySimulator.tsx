import { useMemo } from "react";
import {
  breakevenRevenue,
  effectiveNetBurn,
  formatUsd,
  netBurn,
  projectCash,
  runwayMonthsCashOnly,
  runwayMonthsEffective,
} from "../lib/finance";
import type { CsvModelSuggestion } from "../lib/csvFinance";
import { SCENARIOS, scenarioToRunwayState } from "../lib/scenarios";
import type { RunwayState } from "../types/runway";
import { CashChart } from "./CashChart";
import { CsvImportPanel } from "./CsvImportPanel";
import { SliderRow } from "./SliderRow";

type Props = {
  cashOnHand: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  momGrowthPct: number;
  accountsReceivable: number;
  monthlyDebtService: number;
  arCollectibilityPct: number;
  onCashChange: (v: number) => void;
  onBurnChange: (v: number) => void;
  onRevenueChange: (v: number) => void;
  onMomChange: (v: number) => void;
  onAccountsReceivableChange: (v: number) => void;
  onMonthlyDebtServiceChange: (v: number) => void;
  onArCollectibilityPctChange: (v: number) => void;
  onApplyPreset: (state: RunwayState) => void;
  onApplyCsv: (s: CsvModelSuggestion) => void;
};

export function RunwaySimulator({
  cashOnHand,
  monthlyBurn,
  monthlyRevenue,
  momGrowthPct,
  accountsReceivable,
  monthlyDebtService,
  arCollectibilityPct,
  onCashChange,
  onBurnChange,
  onRevenueChange,
  onMomChange,
  onAccountsReceivableChange,
  onMonthlyDebtServiceChange,
  onArCollectibilityPctChange,
  onApplyPreset,
  onApplyCsv,
}: Props) {
  const stateSlice: RunwayState = {
    cashOnHand,
    monthlyBurn,
    monthlyRevenue,
    momGrowthPct,
    accountsReceivable,
    monthlyDebtService,
    arCollectibilityPct,
  };

  const nbOp = netBurn(monthlyBurn, monthlyRevenue);
  const nbEff = effectiveNetBurn(monthlyBurn, monthlyRevenue, monthlyDebtService);
  const rwEff = runwayMonthsEffective(stateSlice);
  const rwCash = runwayMonthsCashOnly(stateSlice);
  const series = useMemo(
    () => projectCash(cashOnHand, monthlyBurn, monthlyRevenue, momGrowthPct, 12, monthlyDebtService),
    [cashOnHand, monthlyBurn, monthlyRevenue, momGrowthPct, monthlyDebtService]
  );

  const be = breakevenRevenue(monthlyBurn, monthlyDebtService);

  return (
    <section id="runway" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Full runway model
        </h2>
        <p className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Cash, revenue, AR, and debt service — one saved state. Chart uses operating cash path; headline
          runway uses adjusted liquidity.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onApplyPreset(scenarioToRunwayState(s))}
              className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs font-medium text-muted transition hover:border-accent/50 hover:text-ink"
            >
              {s.label}
            </button>
          ))}
        </div>

        <details className="mt-6 rounded-xl border border-line bg-surface/40 p-4">
          <summary className="cursor-pointer font-mono text-sm font-medium text-ink marker:text-muted">
            Import CSV or Excel (optional)
          </summary>
          <div className="mt-4 border-t border-line/80 pt-4">
            <CsvImportPanel onApply={onApplyCsv} />
          </div>
        </details>

        <div className="mt-8 grid gap-8 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Operating & revenue
            </p>
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

            <p className="border-t border-line/80 pt-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Liquidity beyond cash (optional)
            </p>
            <p className="text-xs text-muted">
              Early-stage books are often cash-centric; many teams still have receivables, short-term debt,
              or a LOC. Model them here — not legal or audit advice.
            </p>
            <SliderRow
              label="Accounts receivable (collectible bucket)"
              value={accountsReceivable}
              min={0}
              max={2_000_000}
              step={10_000}
              format={(n) => formatUsd(n, true)}
              onChange={onAccountsReceivableChange}
            />
            <SliderRow
              label="Expected AR → cash (% in near term)"
              value={arCollectibilityPct}
              min={0}
              max={100}
              step={5}
              format={(n) => `${n.toFixed(0)}%`}
              onChange={onArCollectibilityPctChange}
            />
            <SliderRow
              label="Monthly debt service (LOC, loans)"
              value={monthlyDebtService}
              min={0}
              max={150_000}
              step={1_000}
              format={(n) => formatUsd(n, true)}
              onChange={onMonthlyDebtServiceChange}
            />
          </div>

          <div className="rounded-xl border border-line bg-canvas/80 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Net burn (ops)</dt>
                <dd className="font-mono text-ink">{formatUsd(nbOp, true)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">+ Debt service</dt>
                <dd className="font-mono text-ink">{formatUsd(Math.max(0, monthlyDebtService), true)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line/60 pt-3">
                <dt className="text-muted">Effective net / mo</dt>
                <dd className="font-mono font-semibold text-ink">{formatUsd(nbEff, true)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Headline runway</dt>
                <dd className="font-mono font-semibold text-accent">
                  {rwEff === null ? "∞ (effective net ≤ 0)" : `${rwEff.toFixed(1)} mo`}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Cash-only runway</dt>
                <dd className="font-mono text-muted">
                  {rwCash === null ? "∞" : `${rwCash.toFixed(1)} mo`}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Rough breakeven revenue</dt>
                <dd className="font-mono text-ink">{formatUsd(be, true)} / mo</dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              12‑month chart: cash path with revenue growth and debt service; it does not model AR inflows by
              month — use headline runway for AR-adjusted months.
            </p>
            <CashChart series={series} initialCash={cashOnHand} />
          </div>
        </div>
      </div>
    </section>
  );
}

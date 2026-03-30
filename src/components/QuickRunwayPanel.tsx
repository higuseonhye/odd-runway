import { effectiveNetBurn, formatUsd, netBurn, runwayMonthsCashOnly, runwayMonthsEffective } from "../lib/finance";
import { SCENARIOS, scenarioToRunwayState } from "../lib/scenarios";
import type { RunwayState } from "../types/runway";
import { SliderRow } from "./SliderRow";

type Props = {
  runwayState: RunwayState;
  onCashChange: (v: number) => void;
  onBurnChange: (v: number) => void;
  onApplyPreset: (state: RunwayState) => void;
  onOpenFullModel: () => void;
};

export function QuickRunwayPanel({
  runwayState,
  onCashChange,
  onBurnChange,
  onApplyPreset,
  onOpenFullModel,
}: Props) {
  const { cashOnHand, monthlyBurn, monthlyRevenue, accountsReceivable, monthlyDebtService } =
    runwayState;

  const nbOp = netBurn(monthlyBurn, monthlyRevenue);
  const nbEff = effectiveNetBurn(monthlyBurn, monthlyRevenue, monthlyDebtService);
  const rwEff = runwayMonthsEffective(runwayState);
  const rwCash = runwayMonthsCashOnly(runwayState);

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Runway (quick)
        </h2>
        <button
          type="button"
          onClick={onOpenFullModel}
          className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1.5 font-mono text-xs font-medium text-accent transition hover:bg-accent/25"
        >
          Full model →
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        Two sliders on this screen. Add <strong className="text-ink/90">receivables, debt service, and growth</strong>{" "}
        on the{" "}
        <button
          type="button"
          onClick={onOpenFullModel}
          className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
        >
          Runway
        </button>{" "}
        tab — same saved state.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onApplyPreset(scenarioToRunwayState(s))}
            className="rounded-full border border-line bg-canvas/80 px-3 py-1.5 font-mono text-xs font-medium text-muted transition hover:border-accent/50 hover:text-ink"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
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
        <p className="rounded-lg border border-line/80 bg-canvas/50 px-3 py-2 font-mono text-xs text-muted">
          Ops net burn {formatUsd(nbOp, true)}/mo
          {monthlyDebtService > 0 ? (
            <>
              {" "}
              + debt {formatUsd(monthlyDebtService, true)} → effective {formatUsd(nbEff, true)}/mo
            </>
          ) : null}
          {accountsReceivable > 0 ? (
            <> · AR modeled in headline on Runway tab ({formatUsd(accountsReceivable, true)})</>
          ) : null}
        </p>
      </div>

      <dl className="mt-6 flex flex-wrap gap-6 border-t border-line/80 pt-4 text-sm">
        <div>
          <dt className="text-muted">Headline runway</dt>
          <dd className="font-mono font-semibold text-accent">
            {rwEff === null ? "∞" : `${rwEff.toFixed(1)} mo`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Cash-only runway</dt>
          <dd className="font-mono text-muted">{rwCash === null ? "∞" : `${rwCash.toFixed(1)} mo`}</dd>
        </div>
      </dl>
    </div>
  );
}

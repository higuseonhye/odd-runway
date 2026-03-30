import { formatUsd, type MonthProjection } from "../lib/finance";

type Props = {
  series: MonthProjection[];
  initialCash: number;
};

export function CashChart({ series, initialCash }: Props) {
  const values = [initialCash, ...series.map((s) => s.cashEnd)];
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = max - min || 1;

  return (
    <div className="mt-6">
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
        12-month cash (illustrative)
      </p>
      <div className="flex h-36 items-end gap-1 sm:gap-1.5">
        {series.map((s) => {
          const h = ((s.cashEnd - min) / span) * 100;
          const isLow = s.cashEnd < initialCash * 0.25;
          return (
            <div key={s.month} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full min-h-[4px] rounded-t bg-gradient-to-t from-accent/90 to-accent/40 transition-all"
                style={{ height: `${Math.max(8, h)}%` }}
                title={`M${s.month}: ${formatUsd(s.cashEnd)}`}
              />
              <span
                className={`font-mono text-[10px] sm:text-xs ${isLow ? "text-warn" : "text-muted"}`}
              >
                M{s.month}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">
        Assumes constant gross burn and MoM revenue compounding. Not tax or working-capital
        adjusted.
      </p>
    </div>
  );
}

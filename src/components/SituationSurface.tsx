import type { InferredSituation, PressureFlag } from "../lib/situationInference";
import { MODE_LABEL } from "../lib/resilienceContent";

const PRESSURE_CHIPS: { flag: PressureFlag; label: string }[] = [
  { flag: "liquidity_clock", label: "Liquidity clock" },
  { flag: "stakeholder_pressure", label: "Stakeholder pressure" },
  { flag: "execution_risk", label: "Execution risk" },
];

const BADGE: Record<InferredSituation["mode"], string> = {
  normal: "border-ok/40 bg-ok/[0.06] text-ok",
  tight: "border-warn/40 bg-warn/[0.06] text-warn",
  crisis: "border-danger/45 bg-danger/[0.08] text-danger",
  survival: "border-danger/50 bg-danger/[0.1] text-danger",
};

type Props = {
  inferred: InferredSituation;
  flags: Set<PressureFlag>;
  onTogglePressure: (f: PressureFlag) => void;
};

export function SituationSurface({ inferred, flags, onTogglePressure }: Props) {
  const { mode, runwayMonths, silentInsight, pressureAddendum } = inferred;
  const runwayLabel =
    runwayMonths === null
      ? "Net cash-flow positive at these inputs (runway not capped by burn)."
      : `~${runwayMonths.toFixed(1)} mo runway at current net burn.`;

  return (
    <section
      id="situation"
      className="scroll-mt-20 border-b border-line/80 bg-surface/30 px-4 py-10 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${BADGE[mode]}`}
          >
            {MODE_LABEL[mode].label}
          </span>
          <span className="font-mono text-xs text-muted">{runwayLabel}</span>
        </div>
        <p className="mt-4 text-base leading-relaxed text-ink/95">{silentInsight}</p>
        {pressureAddendum ? (
          <p className="mt-3 border-l-2 border-accent/60 pl-4 text-sm text-muted">{pressureAddendum}</p>
        ) : null}

        <div className="mt-6 rounded-xl border border-line/80 bg-canvas/50 p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Optional context — no story required
          </p>
          <p className="mt-1 text-xs text-muted">
            These toggles only adjust the addendum above. They are not sent anywhere.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESSURE_CHIPS.map(({ flag, label }) => {
              const on = flags.has(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => onTogglePressure(flag)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                    on
                      ? "border-accent/60 bg-accent/15 text-ink"
                      : "border-line bg-surface text-muted hover:border-muted/50 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

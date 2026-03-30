import {
  AFTER_IT_ENDS,
  BREAK_CONVENTION,
  HEALTHY_THROUGH,
  WORST_CASE_HORIZON,
  WHEN_STUCK_FEELS_FINAL,
  WORST_EXTREME_LIQUIDITY,
  modePlaybook,
} from "../lib/resilienceContent";
import type { OperatingMode } from "../lib/situationInference";

type Props = {
  mode: OperatingMode;
};

function AccordionBlock(props: {
  title: string;
  items: { id: string; title: string; body: string[] }[];
  defaultOpen?: boolean;
}) {
  const { title, items, defaultOpen } = props;
  return (
    <details
      className="group rounded-xl border border-line/80 bg-surface/40 open:border-accent/25 open:bg-surface/50"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span className="text-[10px] font-normal text-muted group-open:hidden">Expand</span>
          <span className="hidden text-[10px] font-normal text-muted group-open:inline">Collapse</span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-line/60 px-5 pb-5 pt-2">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-line/60 bg-canvas/30 p-4">
            <h4 className="text-sm font-semibold text-ink">{s.title}</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-ink/90 sm:text-sm">
              {s.body.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

export function ResiliencePanel({ mode }: Props) {
  const playbook = modePlaybook(mode);

  return (
    <section id="resilience" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Resilience
          </h2>
          <p className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Expand a section when you need it — not a blog roll.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Execution first; not therapy or legal advice. Not every company survives; the goal is clearer
            options. Legal/tax review for real moves stays on you.
          </p>
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ink">Mode playbook (from your numbers)</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/90">
            {playbook.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div id="when-nothing-feels-possible" className="scroll-mt-8 space-y-3">
          <AccordionBlock title="When nothing feels possible" items={WHEN_STUCK_FEELS_FINAL} defaultOpen />
        </div>

        <AccordionBlock title="Healthy throughput" items={HEALTHY_THROUGH} />
        <AccordionBlock title="Worst-case horizon (execute, then document)" items={WORST_CASE_HORIZON} />
        <AccordionBlock title="When conventions hurt more than they help" items={BREAK_CONVENTION} />

        <div id="worst-extreme-liquidity" className="scroll-mt-8">
          <AccordionBlock
            title="When cash and modeled AR are exhausted — still branches"
            items={WORST_EXTREME_LIQUIDITY}
            defaultOpen
          />
        </div>

        <div id="after-it-ends" className="scroll-mt-8">
          <AccordionBlock title="After the runway math ends" items={AFTER_IT_ENDS} />
        </div>
      </div>
    </section>
  );
}

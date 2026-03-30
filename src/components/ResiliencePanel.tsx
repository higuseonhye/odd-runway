import {
  AFTER_IT_ENDS,
  BREAK_CONVENTION,
  HEALTHY_THROUGH,
  WORST_CASE_HORIZON,
  WHEN_STUCK_FEELS_FINAL,
  modePlaybook,
} from "../lib/resilienceContent";
import type { OperatingMode } from "../lib/situationInference";

type Props = {
  mode: OperatingMode;
};

function SectionBlock(props: {
  title: string;
  items: { id: string; title: string; body: string[] }[];
}) {
  const { title, items } = props;
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">{title}</h3>
      <div className="space-y-6">
        {items.map((s) => (
          <div key={s.id} className="rounded-xl border border-line/80 bg-surface/40 p-5 sm:p-6">
            <h4 className="text-base font-semibold text-ink">{s.title}</h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/90">
              {s.body.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResiliencePanel({ mode }: Props) {
  const playbook = modePlaybook(mode);

  return (
    <section id="resilience" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-12">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Resilience
          </h2>
          <p className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-ink">
            Ways through — without having to explain yourself out loud.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Execution first — this section orients your next moves; it is not therapy or legal advice. Not
            every company survives as a going concern; the goal here is clearer options, not a guaranteed
            save. When you close a bridge, restructure, or wind down, get legal and tax review so those
            moves do not create a new problem.
          </p>
        </div>

        <div id="when-nothing-feels-possible" className="scroll-mt-8">
          <SectionBlock title="When nothing feels possible" items={WHEN_STUCK_FEELS_FINAL} />
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ink">Mode playbook (from your numbers)</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/90">
            {playbook.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <SectionBlock title="Healthy throughput" items={HEALTHY_THROUGH} />
        <SectionBlock title="Worst-case horizon (execute, then document)" items={WORST_CASE_HORIZON} />
        <SectionBlock title="When conventions hurt more than they help" items={BREAK_CONVENTION} />

        <div id="after-it-ends" className="scroll-mt-8">
          <SectionBlock title="After the runway math ends" items={AFTER_IT_ENDS} />
        </div>
      </div>
    </section>
  );
}

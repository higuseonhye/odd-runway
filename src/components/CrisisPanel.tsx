import { crisisCopy, tierForRunwayMonths, type CrisisTier } from "../lib/crisis";

type Props = {
  runwayMonths: number | null;
};

const tierStyles: Record<CrisisTier, string> = {
  critical: "border-danger/45 bg-danger/[0.06]",
  warning: "border-warn/40 bg-warn/[0.05]",
  stable: "border-ok/35 bg-ok/[0.05]",
};

const dotStyles: Record<CrisisTier, string> = {
  critical: "bg-danger",
  warning: "bg-warn",
  stable: "bg-ok",
};

export function CrisisPanel({ runwayMonths }: Props) {
  const tier = tierForRunwayMonths(runwayMonths);
  const copy = crisisCopy(runwayMonths)[tier];

  return (
    <section id="crisis" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Crisis playbook
        </h2>
        <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-ink">
          When runway hits the floor — act, don&apos;t spiral.
        </p>
        <div className={`mt-8 rounded-xl border p-5 sm:p-6 ${tierStyles[tier]}`}>
          <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
            <span className={`h-2 w-2 rounded-full ${dotStyles[tier]}`} aria-hidden />
            {copy.title}
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink/95">
            {copy.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <div
            className="mt-5 border-l-2 border-accent pl-4 text-sm text-muted [&_strong]:font-semibold [&_strong]:text-ink"
            dangerouslySetInnerHTML={{ __html: copy.insightHtml }}
          />
        </div>
      </div>
    </section>
  );
}

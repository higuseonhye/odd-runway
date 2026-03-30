import type { ActionCard } from "../lib/actionCards";
import { categoryLabel } from "../lib/actionCards";

type Props = {
  cards: ActionCard[];
  onNavigate: (hash: string) => void;
};

export function ActionCards({ cards, onNavigate }: Props) {
  return (
    <aside className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Next moves
        </h2>
        <span className="font-mono text-[10px] text-muted">Cards · agents (roadmap)</span>
      </div>
      <ul className="space-y-2">
        {cards.map((c) => (
          <li key={c.id}>
            {c.status === "ready" && c.href ? (
              <button
                type="button"
                onClick={() => onNavigate(c.href!)}
                className="w-full rounded-xl border border-line bg-surface/80 p-4 text-left transition hover:border-accent/40 hover:bg-surface"
              >
                <CardInner c={c} />
              </button>
            ) : (
              <div className="rounded-xl border border-line/80 bg-canvas/60 p-4 opacity-95">
                <CardInner c={c} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function CardInner({ c }: { c: ActionCard }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
          {categoryLabel(c.category)}
        </span>
        {c.status === "roadmap" ? (
          <span className="rounded-full border border-warn/35 bg-warn/10 px-2 py-0.5 font-mono text-[10px] text-warn">
            Roadmap
          </span>
        ) : (
          <span className="rounded-full border border-ok/35 bg-ok/10 px-2 py-0.5 font-mono text-[10px] text-ok">
            Open
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold text-ink">{c.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{c.subtitle}</p>
    </>
  );
}
